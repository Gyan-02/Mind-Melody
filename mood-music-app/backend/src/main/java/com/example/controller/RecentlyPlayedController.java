package com.example.controller;

import com.example.model.RecentlyPlayed;
import com.example.repository.RecentlyPlayedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recently-played")
public class RecentlyPlayedController {

    @Autowired
    private RecentlyPlayedRepository recentlyPlayedRepository;

    @GetMapping
    public ResponseEntity<List<RecentlyPlayed>> getRecentlyPlayed() {
        return ResponseEntity.ok(recentlyPlayedRepository.findTop20ByOrderByPlayedAtDesc());
    }

    @PostMapping
    public ResponseEntity<RecentlyPlayed> addRecentlyPlayed(@RequestBody RecentlyPlayed song) {
        return ResponseEntity.ok(recentlyPlayedRepository.save(song));
    }
}
