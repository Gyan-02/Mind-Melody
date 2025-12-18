package com.example.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

@Entity
@Table(name = "recently_played")
public class RecentlyPlayed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "artist")
    private String artist;
    
    @Column(name = "mood")
    private String mood;
    
    @Column(name = "preview_url", length = 1000)
    private String previewUrl;
    
    @Column(name = "cover_url", length = 1000)
    private String coverUrl;
    
    @Column(name = "played_at", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime playedAt;

    @PrePersist
    protected void onCreate() {
        if (playedAt == null) {
            playedAt = LocalDateTime.now();
        }
    }

    public RecentlyPlayed() {
    }

    public RecentlyPlayed(String title, String artist, String mood, String previewUrl, String coverUrl) {
        this.title = title;
        this.artist = artist;
        this.mood = mood;
        this.previewUrl = previewUrl;
        this.coverUrl = coverUrl;
        this.playedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public String getPreviewUrl() {
        return previewUrl;
    }

    public void setPreviewUrl(String previewUrl) {
        this.previewUrl = previewUrl;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public LocalDateTime getPlayedAt() {
        return playedAt;
    }

    public void setPlayedAt(LocalDateTime playedAt) {
        this.playedAt = playedAt;
    }
}
