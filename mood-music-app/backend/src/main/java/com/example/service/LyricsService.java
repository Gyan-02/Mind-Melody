package com.example.service;

import com.example.model.Lyrics;
import com.example.repository.LyricsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LyricsService {

    @Autowired
    private LyricsRepository lyricsRepository;

    @Autowired
    private AlignmentService alignmentService;

    public Optional<Lyrics> getLyrics(String trackId) {
        return lyricsRepository.findByTrackId(trackId);
    }

    public Lyrics alignAndSave(String trackId, String previewUrl, String rawText) {
        // Check if exists
        Optional<Lyrics> existing = lyricsRepository.findByTrackId(trackId);
        if (existing.isPresent()) {
            // Update existing? Or just return?
            // If user is re-submitting, we should probably update.
            Lyrics lyrics = existing.get();
            String syncedContent = alignmentService.alignLyrics(rawText, 30.0); // Assuming 30s preview
            lyrics.setContent(syncedContent);
            lyrics.setPreviewUrl(previewUrl);
            lyrics.setSynced(true);
            return lyricsRepository.save(lyrics);
        } else {
            String syncedContent = alignmentService.alignLyrics(rawText, 30.0);
            Lyrics lyrics = new Lyrics(trackId, previewUrl, syncedContent, true);
            return lyricsRepository.save(lyrics);
        }
    }
}
