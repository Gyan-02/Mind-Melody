package com.example.controller;

import com.example.model.Song;
import com.example.repository.SongRepository;
import com.example.service.ITunesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    @Autowired
    private SongRepository songRepository;
    
    @Autowired
    private ITunesService itunesService;

    @GetMapping("/search")
    public ResponseEntity<List<Song>> searchSongs(@RequestParam String query) {
        List<Song> songs = itunesService.searchSongs(query);
        return ResponseEntity.ok(songs);
    }

    @GetMapping("/{mood}")
    public ResponseEntity<Map<String, Object>> getSongsByMood(@PathVariable String mood) {
        // Try to fetch from iTunes API first
        List<Song> songs = itunesService.searchSongsByMood(mood);
        
        // Fallback to database if iTunes API fails
        if (songs.isEmpty()) {
            System.out.println("iTunes API returned no results, falling back to database");
            songs = songRepository.findByMood(mood);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("songs", songs);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<List<Song>> getSongsByMoodPost(@RequestBody Map<String, String> request) {
        String mood = request.get("mood");
        if (mood == null || mood.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Try to fetch from iTunes API first
        List<Song> songs = itunesService.searchSongsByMood(mood);
        
        // Fallback to database if iTunes API fails
        if (songs.isEmpty()) {
            System.out.println("iTunes API returned no results, falling back to database");
            songs = songRepository.findByMood(mood);
        }
        
        return ResponseEntity.ok(songs);
    }
}
