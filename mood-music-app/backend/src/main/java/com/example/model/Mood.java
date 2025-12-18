package com.example.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "moods")
public class Mood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "mood_type", nullable = false, length = 100)
    private String moodType;
    
    @Column(name = "song_recommendation", length = 255)
    private String songRecommendation;
    
    @Column(name = "preview_url", length = 255)
    private String previewUrl;
    
    @Column(name = "cover_url", length = 255)
    private String coverUrl;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Mood() {
    }

    public Mood(Long id, String moodType, String songRecommendation, String previewUrl, String coverUrl) {
        this.id = id;
        this.moodType = moodType;
        this.songRecommendation = songRecommendation;
        this.previewUrl = previewUrl;
        this.coverUrl = coverUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMoodType() {
        return moodType;
    }

    public void setMoodType(String moodType) {
        this.moodType = moodType;
    }

    public String getSongRecommendation() {
        return songRecommendation;
    }

    public void setSongRecommendation(String songRecommendation) {
        this.songRecommendation = songRecommendation;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}