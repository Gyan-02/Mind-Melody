package com.example.controller;

import com.example.model.LikedSong;
import com.example.repository.LikedSongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/liked")
public class LikedSongController {

    @Autowired
    private LikedSongRepository likedSongRepository;

    @GetMapping
    public ResponseEntity<List<LikedSong>> getAllLikedSongs() {
        return ResponseEntity.ok(likedSongRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<LikedSong> likeSong(@RequestBody LikedSong song) {
        // Check if already liked
        Optional<LikedSong> existing = likedSongRepository.findByPreviewUrl(song.getPreviewUrl());
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }
        return ResponseEntity.ok(likedSongRepository.save(song));
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<Void> unlikeSong(@RequestParam String previewUrl) {
        likedSongRepository.deleteByPreviewUrl(previewUrl);
        return ResponseEntity.ok().build();
    }
}
