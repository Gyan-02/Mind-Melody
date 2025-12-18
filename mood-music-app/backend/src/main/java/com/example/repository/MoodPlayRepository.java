package com.example.repository;

import com.example.model.MoodPlay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MoodPlayRepository extends JpaRepository<MoodPlay, Long> {
    List<MoodPlay> findTop50ByOrderByPlayedAtDesc();
    
    @Query("SELECT COUNT(mp) FROM MoodPlay mp")
    long countMoodPlays();
    
    @Query("SELECT mp.moodType as moodType, COUNT(mp) as playCount " +
           "FROM MoodPlay mp " +
           "WHERE mp.playedAt >= :since " +
           "GROUP BY mp.moodType " +
           "ORDER BY COUNT(mp) DESC")
    List<Object[]> findMoodStatsSince(LocalDateTime since);
}
