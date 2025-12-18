package com.example.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lyrics")
public class Lyrics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "track_id", nullable = false, unique = true)
    private String trackId;

    @Column(name = "preview_url", length = 1000)
    private String previewUrl;

    @Lob
    @Column(name = "content", columnDefinition = "TEXT")
    private String content; // JSON string of timestamped lyrics

    @Column(name = "is_synced")
    private boolean isSynced;

    public Lyrics() {
    }

    public Lyrics(String trackId, String previewUrl, String content, boolean isSynced) {
        this.trackId = trackId;
        this.previewUrl = previewUrl;
        this.content = content;
        this.isSynced = isSynced;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isSynced() {
        return isSynced;
    }

    public void setSynced(boolean synced) {
        isSynced = synced;
    }
}
