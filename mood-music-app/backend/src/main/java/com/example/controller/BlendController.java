package com.example.controller;

import com.example.model.Blend;
import com.example.model.Song;
import com.example.model.User;
import com.example.repository.BlendRepository;
import com.example.repository.PlaylistRepository;
import com.example.repository.SongRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/blends")
public class BlendController {

    @Autowired
    private BlendRepository blendRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private SongRepository songRepository;

    // Helper to handle default user resolution
    private User resolveUser(Long requestedId) {
        if (requestedId != null && userRepository.existsById(requestedId)) {
            return userRepository.findById(requestedId).get();
        }
        return userRepository.findAll().stream().findFirst()
                .orElseGet(() -> userRepository.save(new User("Gyan", "https://i.pravatar.cc/150?u=gyan")));
    }

    // Create a new blend and get invite code
    @PostMapping
    public ResponseEntity<Blend> createBlend(@RequestBody Map<String, Object> payload) {
        Long requestedUserId = ((Number) payload.getOrDefault("userId", 1)).longValue();
        User user1 = resolveUser(requestedUserId);

        String inviteCode = UUID.randomUUID().toString().substring(0, 8);
        Blend blend = new Blend("Blend Request", user1, inviteCode);
        
        return ResponseEntity.ok(blendRepository.save(blend));
    }

    // Join a blend
    @PostMapping("/join")
    public ResponseEntity<?> joinBlend(@RequestBody Map<String, Object> payload) {
        String inviteCode = (String) payload.get("inviteCode");
        String guestName = (String) payload.get("guestName"); // Simulate second user name
        
        try {
            Optional<Blend> blendOpt = blendRepository.findByInviteCode(inviteCode);
            if (blendOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid invite code");
            }

            Blend blend = blendOpt.get();
            if (blend.getUser2() != null) {
                return ResponseEntity.badRequest().body("Blend is already full");
            }

            // Create guest user
            User user2 = userRepository.save(new User(guestName, "https://i.pravatar.cc/150?u=" + guestName));
            blend.setUser2(user2);
            
            // Update name
            blend.setName(blend.getUser1().getName() + " + " + user2.getName());
            
            // 1. Get Host's (User1) songs from their playlists
            if (playlistRepository == null) {
                System.out.println("CRITICAL: PlaylistRepository is NULL");
                throw new RuntimeException("PlaylistRepository is not injected!");
            }
            Long u1Id = blend.getUser1().getId();
            System.out.println("Fetching playlists for user: " + u1Id);
            
            List<com.example.model.Playlist> user1Playlists = playlistRepository.findByUserId(u1Id);
            if (user1Playlists == null) {
                System.out.println("User has NULL playlists list");
                user1Playlists = new ArrayList<>();
            }
            System.out.println("Found playlists: " + user1Playlists.size());

            List<Song> initialUser1Songs = user1Playlists.stream()
                    .filter(p -> p.getSongs() != null)
                    .flatMap(p -> p.getSongs().stream())
                    .distinct()
                    .collect(java.util.stream.Collectors.toList());
            
            System.out.println("Found unique songs: " + initialUser1Songs.size());

            // Mutable list for final selection
            List<Song> user1Songs = new ArrayList<>(initialUser1Songs);

            // 2. Get Guest's (User2) songs - Simulate by picking random songs NOT in User1's list
            List<Song> allSongs = songRepository.findAll();
            List<Song> guestPotentialSongs = allSongs.stream()
                    .filter(s -> !initialUser1Songs.contains(s)) // Use effectively final list
                    .collect(java.util.stream.Collectors.toList());
            Collections.shuffle(guestPotentialSongs);
            List<Song> user2Songs = guestPotentialSongs.stream().limit(10).toList(); // Guest brings 10 songs

            // If User 1 has no songs, give them some random ones too
            if (user1Songs.isEmpty()) {
                List<Song> remaining = allSongs.stream().filter(s -> !user2Songs.contains(s)).collect(java.util.stream.Collectors.toList());
                Collections.shuffle(remaining);
                user1Songs = remaining.stream().limit(10).collect(java.util.stream.Collectors.toList());
            }

            // 3. Mix them (Interleave or shuffle final list)
            System.out.println("Shuffling songs...");
            // Take up to 7 from each to make a ~15 song playlist
            Collections.shuffle(user1Songs);
            List<Song> finalUser1Selection = user1Songs.stream().limit(8).collect(java.util.stream.Collectors.toList());
            List<Song> finalUser2Selection = user2Songs.stream().limit(7).collect(java.util.stream.Collectors.toList());

            // Add entries
            Random random = new Random();
            for (Song s : finalUser1Selection) {
                blend.addBlendSong(new com.example.model.BlendSong(blend, s, blend.getUser1()));
            }
            for (Song s : finalUser2Selection) {
                blend.addBlendSong(new com.example.model.BlendSong(blend, s, user2));
            }
            
            blend.setMatchScore(85 + random.nextInt(15)); // Random score 85-99%
            
            System.out.println("Saving blend...");
            Blend savedBlend = blendRepository.save(blend);
            System.out.println("Blend saved successfully.");

            return ResponseEntity.ok(savedBlend);
        } catch (Exception e) {
            e.printStackTrace(); // Print to console for debugging
            System.out.println("ERROR IN JOIN BLEND: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error joining blend: " + e.getMessage());
            error.put("stack", Arrays.toString(e.getStackTrace()));
            return ResponseEntity.internalServerError().body(error);
        }
    }

    // Get blend details
    @GetMapping("/{id}")
    public ResponseEntity<Blend> getBlend(@PathVariable Long id) {
        return blendRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
