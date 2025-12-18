package com.example.service;

import com.example.model.Song;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ITunesService {
    
    private static final String ITUNES_API_URL = "https://itunes.apple.com/search";
    private static final int RESULT_LIMIT = 10;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    // Mood to search keyword mapping
    private static final Map<String, String> MOOD_KEYWORDS = Map.of(
        "happy", "upbeat happy energetic positive",
        "sad", "melancholic emotional sad ballad",
        "relaxed", "calm relaxing peaceful ambient chill",
        "energetic", "energetic upbeat powerful dance",
        "angry", "intense powerful aggressive",
        "romantic", "romantic love emotional",
        "focused", "focus concentration instrumental ambient",
        "anxious", "calm soothing peaceful relaxing"
    );
    
    public ITunesService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Search for songs based on mood
     * @param mood The mood string (can be from sentiment analysis)
     * @return List of Song objects with iTunes data
     */
    public List<Song> searchSongsByMood(String mood) {
        try {
            String keywords = getMoodKeywords(mood.toLowerCase());
            String url = String.format("%s?term=%s&media=music&entity=song&limit=%d",
                    ITUNES_API_URL,
                    keywords.replace(" ", "+"),
                    RESULT_LIMIT);
            
            System.out.println("Fetching songs from iTunes API: " + url);
            
            String response = restTemplate.getForObject(url, String.class);
            return parseITunesResponse(response, mood);
            
        } catch (Exception e) {
            System.err.println("Error fetching songs from iTunes API: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    /**
     * Search for songs based on a direct query
     * @param query The search query
     * @return List of Song objects with iTunes data
     */
    public List<Song> searchSongs(String query) {
        try {
            String url = String.format("%s?term=%s&media=music&entity=song&limit=%d",
                    ITUNES_API_URL,
                    query.replace(" ", "+"),
                    RESULT_LIMIT);
            
            System.out.println("Searching songs from iTunes API: " + url);
            
            String response = restTemplate.getForObject(url, String.class);
            return parseITunesResponse(response, "Search Result");
            
        } catch (Exception e) {
            System.err.println("Error searching songs from iTunes API: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
    
    /**
     * Get search keywords based on mood
     */
    private String getMoodKeywords(String mood) {
        // Try exact match first
        for (Map.Entry<String, String> entry : MOOD_KEYWORDS.entrySet()) {
            if (mood.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        
        // Default to the mood itself + "music" if no match
        return mood + " music";
    }
    
    /**
     * Parse iTunes API response and convert to Song objects
     */
    private List<Song> parseITunesResponse(String jsonResponse, String mood) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode results = root.get("results");
            
            if (results == null || !results.isArray()) {
                return Collections.emptyList();
            }
            
            List<Song> songs = new ArrayList<>();
            for (JsonNode item : results) {
                try {
                    Song song = new Song();
                    
                    // Set basic info
                    String trackName = item.get("trackName").asText();
                    String artistName = item.get("artistName").asText();
                    song.setTitle(trackName + " - " + artistName);
                    song.setMood(mood);
                    
                    // Set preview URL (30-second audio preview)
                    if (item.has("previewUrl")) {
                        song.setPreviewUrl(item.get("previewUrl").asText());
                    }
                    
                    // Set artwork URL (album cover)
                    if (item.has("artworkUrl100")) {
                        // Get higher quality artwork (600x600 instead of 100x100)
                        String artworkUrl = item.get("artworkUrl100").asText()
                                .replace("100x100bb", "600x600bb");
                        song.setCoverUrl(artworkUrl);
                    }
                    
                    songs.add(song);
                } catch (Exception e) {
                    System.err.println("Error parsing song item: " + e.getMessage());
                }
            }
            
            System.out.println("Successfully parsed " + songs.size() + " songs from iTunes");
            return songs;
            
        } catch (Exception e) {
            System.err.println("Error parsing iTunes response: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
