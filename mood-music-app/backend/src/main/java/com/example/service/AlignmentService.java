package com.example.service;

import java.util.List;
import java.util.Map;

public interface AlignmentService {
    /**
     * Aligns the provided lyrics text to the audio duration.
     * @param lyricsText The raw lyrics text.
     * @param durationSeconds The duration of the audio in seconds.
     * @return A JSON string representing the timestamped lyrics.
     */
    String alignLyrics(String lyricsText, double durationSeconds);
}
