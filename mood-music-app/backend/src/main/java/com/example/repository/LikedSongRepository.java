package com.example.repository;

import com.example.model.LikedSong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikedSongRepository extends JpaRepository<LikedSong, Long> {
    Optional<LikedSong> findByPreviewUrl(String previewUrl);
    void deleteByPreviewUrl(String previewUrl);
}
