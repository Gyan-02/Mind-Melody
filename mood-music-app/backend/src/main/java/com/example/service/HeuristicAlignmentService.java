package com.example.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HeuristicAlignmentService implements AlignmentService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String alignLyrics(String lyricsText, double durationSeconds) {
        if (lyricsText == null || lyricsText.isEmpty()) {
            return "[]";
        }

        String[] lines = lyricsText.split("\\r?\\n");
        List<Map<String, Object>> syncedLyrics = new ArrayList<>();
        
        // Filter out empty lines to avoid wasting time slots on them, or keep them?
        // Better to filter empty lines for better pacing.
        List<String> nonEmptyLines = new ArrayList<>();
        for (String line : lines) {
            if (!line.trim().isEmpty()) {
                nonEmptyLines.add(line.trim());
            }
        }

        if (nonEmptyLines.isEmpty()) {
            return "[]";
        }

        double timePerLine = durationSeconds / nonEmptyLines.size();
        double currentTime = 0.0;

        for (String line : nonEmptyLines) {
            Map<String, Object> lineData = new HashMap<>();
            lineData.put("text", line);
            lineData.put("time", currentTime);
            syncedLyrics.add(lineData);
            currentTime += timePerLine;
        }

        try {
            return objectMapper.writeValueAsString(syncedLyrics);
        } catch (Exception e) {
            e.printStackTrace();
            return "[]";
        }
    }
}
