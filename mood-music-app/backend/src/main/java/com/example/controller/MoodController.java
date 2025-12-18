package com.example.controller;

import com.example.model.Mood;
import com.example.model.MoodPlay;
import com.example.repository.MoodRepository;
import com.example.repository.MoodPlayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/moods")
public class MoodController {

    @Autowired
    private MoodRepository moodRepository;
    
    @Autowired
    private MoodPlayRepository moodPlayRepository;

    @GetMapping
    public ResponseEntity<List<Mood>> getMoods() {
        List<Mood> moods = moodRepository.findByOrderByCreatedAtDesc();
        return ResponseEntity.ok(moods);
    }

    @PostMapping
    public ResponseEntity<Mood> addMood(@RequestBody Mood mood) {
        Mood savedMood = moodRepository.save(mood);
        return ResponseEntity.status(201).body(savedMood);
    }
    
    @PostMapping("/track-play")
    public ResponseEntity<Map<String, Object>> trackMoodPlay(@RequestBody Map<String, String> request) {
        String moodType = request.get("moodType");
        String songTitle = request.get("songTitle");
        String sessionId = request.get("sessionId");
        
        if (moodType == null || moodType.trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "missing mood type");
            return ResponseEntity.badRequest().body(error);
        }
        
        MoodPlay moodPlay = new MoodPlay(moodType, songTitle, sessionId);
        moodPlayRepository.save(moodPlay);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Mood play tracked");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getMoodHistory() {
        try {
            System.out.println("Fetching mood history...");
            List<MoodPlay> history = moodPlayRepository.findTop50ByOrderByPlayedAtDesc();
            long totalCount = moodPlayRepository.countMoodPlays();
            System.out.println("Found " + history.size() + " history entries out of " + totalCount + " total entries");
            
            Map<String, Object> response = new HashMap<>();
            response.put("history", history);
            response.put("totalCount", totalCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error fetching mood history: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to fetch history: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> getDebugInfo() {
        Map<String, Object> debug = new HashMap<>();
        try {
            long totalCount = moodPlayRepository.countMoodPlays();
            debug.put("totalMoodPlays", totalCount);
            debug.put("status", "Database connection OK");
            debug.put("timestamp", LocalDateTime.now());
            return ResponseEntity.ok(debug);
        } catch (Exception e) {
            debug.put("error", e.getMessage());
            debug.put("status", "Database connection failed");
            debug.put("timestamp", LocalDateTime.now());
            return ResponseEntity.internalServerError().body(debug);
        }
    }

    @DeleteMapping("/history")
    public ResponseEntity<Map<String, Object>> clearMoodHistory() {
        moodPlayRepository.deleteAll();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Mood history cleared");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getMoodStats() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<Object[]> statsRaw = moodPlayRepository.findMoodStatsSince(thirtyDaysAgo);
        
        List<Map<String, Object>> stats = statsRaw.stream().map(row -> {
            Map<String, Object> stat = new HashMap<>();
            stat.put("mood_type", row[0]);
            stat.put("play_count", row[1]);
            return stat;
        }).collect(java.util.stream.Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("stats", stats);
        return ResponseEntity.ok(response);
    }
}