package com.example.dao;

import com.example.model.Mood;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MoodDao {
    private Connection connection;

    public MoodDao(Connection connection) {
        this.connection = connection;
    }

    public void saveMood(Mood mood) throws SQLException {
        String sql = "INSERT INTO moods (mood_type, song_recommendation) VALUES (?, ?)";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, mood.getMoodType());
            statement.setString(2, mood.getSongRecommendation());
            statement.executeUpdate();
        }
    }

    public List<Mood> getAllMoods() throws SQLException {
        List<Mood> moods = new ArrayList<>();
        String sql = "SELECT * FROM moods";
        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                Mood mood = new Mood();
                mood.setId(resultSet.getInt("id"));
                mood.setMoodType(resultSet.getString("mood_type"));
                mood.setSongRecommendation(resultSet.getString("song_recommendation"));
                moods.add(mood);
            }
        }
        return moods;
    }
}