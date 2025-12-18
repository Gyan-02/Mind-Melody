package com.example.model;

import jakarta.persistence.*;

@Entity
@Table(name = "liked_songs")
public class LikedSong {
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

    public LikedSong() {
    }

    public LikedSong(String title, String artist, String mood, String previewUrl, String coverUrl) {
        this.title = title;
        this.artist = artist;
        this.mood = mood;
        this.previewUrl = previewUrl;
        this.coverUrl = coverUrl;
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
}
