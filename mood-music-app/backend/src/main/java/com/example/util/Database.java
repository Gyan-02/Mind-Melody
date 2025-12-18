package com.example.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    private static final String URL = System.getenv("DB_URL") != null ? 
            System.getenv("DB_URL") : "jdbc:mysql://localhost:3306/mind_melody";
    private static final String USER = System.getenv("DB_USER") != null ? 
            System.getenv("DB_USER") : "root";
    private static final String PASSWORD = System.getenv("DB_PASSWORD") != null ? 
            System.getenv("DB_PASSWORD") : "Poorvee@3913";
    private Connection connection;

    public Connection connect() {
        try {
            if (connection == null || connection.isClosed()) {
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return connection;
    }

    public void disconnect() {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}