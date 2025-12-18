package com.example.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "blend_song_items")
public class BlendSong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "blend_id", nullable = false)
    @JsonIgnore
    private Blend blend;

    @ManyToOne
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @ManyToOne
    @JoinColumn(name = "added_by_user_id", nullable = false)
    private User addedBy;

    public BlendSong() {}

    public BlendSong(Blend blend, Song song, User addedBy) {
        this.blend = blend;
        this.song = song;
        this.addedBy = addedBy;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Blend getBlend() { return blend; }
    public void setBlend(Blend blend) { this.blend = blend; }
    public Song getSong() { return song; }
    public void setSong(Song song) { this.song = song; }
    public User getAddedBy() { return addedBy; }
    public void setAddedBy(User addedBy) { this.addedBy = addedBy; }
}
