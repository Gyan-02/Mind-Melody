package com.example.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "blends")
public class Blend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne(optional = true) // Nullable until second user joins
    @JoinColumn(name = "user2_id", nullable = true)
    private User user2;

    @Column(name = "match_score")
    private Integer matchScore;

    @OneToMany(mappedBy = "blend", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BlendSong> blendSongs = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Invite code mechanism
    @Column(name = "invite_code", unique = true)
    private String inviteCode;

    public Blend() {}

    public Blend(String name, User user1, String inviteCode) {
        this.name = name;
        this.user1 = user1;
        this.inviteCode = inviteCode;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public User getUser1() { return user1; }
    public void setUser1(User user1) { this.user1 = user1; }
    public User getUser2() { return user2; }
    public void setUser2(User user2) { this.user2 = user2; }
    public Integer getMatchScore() { return matchScore; }
    public void setMatchScore(Integer matchScore) { this.matchScore = matchScore; }
    public List<BlendSong> getBlendSongs() { return blendSongs; }
    public void setBlendSongs(List<BlendSong> blendSongs) { this.blendSongs = blendSongs; }
    
    public void addBlendSong(BlendSong blendSong) {
        blendSongs.add(blendSong);
        blendSong.setBlend(this);
    }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getInviteCode() { return inviteCode; }
    public void setInviteCode(String inviteCode) { this.inviteCode = inviteCode; }
}
