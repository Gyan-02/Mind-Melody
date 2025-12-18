package com.example.controller;

import com.example.model.Playlist;
import com.example.model.Song;
import com.example.model.User;
import com.example.repository.PlaylistRepository;
import com.example.repository.SongRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private UserRepository userRepository;

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

    // Get all playlists for a user
    @GetMapping
    public ResponseEntity<List<Playlist>> getPlaylists(@RequestParam(defaultValue = "1") Long userId) {
        User user = resolveUser(userId);
        return ResponseEntity.ok(playlistRepository.findByUserId(user.getId()));
    }

    // Get specific playlist
    @GetMapping("/{id}")
    public ResponseEntity<Playlist> getPlaylist(@PathVariable Long id) {
        return playlistRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new playlist
    @PostMapping
    public ResponseEntity<Playlist> createPlaylist(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        Long requestedUserId = ((Number) payload.getOrDefault("userId", 1)).longValue();
        
        User user = resolveUser(requestedUserId);

        Playlist playlist = new Playlist(name, user);
        return ResponseEntity.ok(playlistRepository.save(playlist));
    }

    // Add song to playlist
    @PostMapping("/{id}/songs")
    public ResponseEntity<?> addSongToPlaylist(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        Long songId = payload.get("songId");
        
        Playlist playlist = playlistRepository.findById(id)
                .orElse(null);
        
        if (playlist == null) {
            return ResponseEntity.notFound().build();
        }

        Song song = songRepository.findById(songId).orElse(null);
        if (song == null) {
            return ResponseEntity.badRequest().body("Song not found");
        }

        playlist.addSong(song);
        playlistRepository.save(playlist);

        return ResponseEntity.ok(playlist);
    }
}
