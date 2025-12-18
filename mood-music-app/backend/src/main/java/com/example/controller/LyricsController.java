package com.example.controller;

import com.example.model.Lyrics;
import com.example.service.LyricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/lyrics")
public class LyricsController {

    @Autowired
    private LyricsService lyricsService;

    @GetMapping("/{trackId}")
    public ResponseEntity<Lyrics> getLyrics(@PathVariable String trackId) {
        return lyricsService.getLyrics(trackId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/align")
    public ResponseEntity<Lyrics> alignLyrics(@RequestBody LyricsRequest request) {
        Lyrics lyrics = lyricsService.alignAndSave(
                request.getTrackId(),
                request.getPreviewUrl(),
                request.getText()
        );
        return ResponseEntity.ok(lyrics);
    }

    public static class LyricsRequest {
        private String trackId;
        private String previewUrl;
        private String text;

        public String getTrackId() {
            return trackId;
        }

        public void setTrackId(String trackId) {
            this.trackId = trackId;
        }

        public String getPreviewUrl() {
            return previewUrl;
        }

        public void setPreviewUrl(String previewUrl) {
            this.previewUrl = previewUrl;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}
