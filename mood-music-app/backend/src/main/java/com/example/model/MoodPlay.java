package com.example.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mood_plays")
public class MoodPlay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "mood_type", nullable = false, length = 100)
    private String moodType;
    
    @Column(name = "song_title", length = 255)
    private String songTitle;
    
    @Column(name = "played_at")
    private LocalDateTime playedAt = LocalDateTime.now();
    
    @Column(name = "session_id", length = 255)
    private String sessionId;

    public MoodPlay() {
    }

    public MoodPlay(String moodType, String songTitle, String sessionId) {
        this.moodType = moodType;
        this.songTitle = songTitle;
        this.sessionId = sessionId;
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

    public String getSongTitle() {
        return songTitle;
    }

    public void setSongTitle(String songTitle) {
        this.songTitle = songTitle;
    }

    public LocalDateTime getPlayedAt() {
        return playedAt;
    }

    public void setPlayedAt(LocalDateTime playedAt) {
        this.playedAt = playedAt;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
