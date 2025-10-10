-- Mind Melody Database Setup
-- Run this in MySQL Workbench or your MySQL client

CREATE DATABASE IF NOT EXISTS mind_melody;
USE mind_melody;

-- Create moods table
CREATE TABLE IF NOT EXISTS moods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mood_type VARCHAR(100) NOT NULL,
  song_recommendation VARCHAR(255),
  preview_url VARCHAR(255),
  cover_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_mood_type (mood_type),
  INDEX idx_created_at (created_at)
);

-- Create mood_plays table for tracking
CREATE TABLE IF NOT EXISTS mood_plays (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mood_type VARCHAR(100) NOT NULL,
  song_title VARCHAR(255),
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_id VARCHAR(255),
  INDEX idx_mood_plays (mood_type, played_at),
  INDEX idx_session (session_id)
);

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  mood VARCHAR(80),
  preview_url VARCHAR(255),
  cover_url VARCHAR(255)
);

-- Insert sample songs data
INSERT IGNORE INTO songs (title, mood, preview_url, cover_url) VALUES
-- Happy Mood
('Happy — Pharrell Williams', 'Happy', '/assets/previews/happy.mp3', '/assets/covers/happy.jpg'),
('Uptown Funk — Mark Ronson ft. Bruno Mars', 'Happy', '/assets/previews/uptown-funk.mp3', '/assets/covers/uptown-funk.jpg'),
('Shake It Off — Taylor Swift', 'Happy', '/assets/previews/shake-it-off.mp3', '/assets/covers/taylor-swift.jpg'),

-- Sad Mood
('Someone Like You — Adele', 'Sad', '/assets/previews/someone-like-you.mp3', '/assets/covers/adele.jpg'),
('All Too Well — Taylor Swift', 'Sad', '/assets/previews/all-too-well.mp3', '/assets/covers/taylor-sad.jpg'),
('When I Was Your Man — Bruno Mars', 'Sad', '/assets/previews/when-i-was-your-man.mp3', '/assets/covers/bruno-sad.jpg'),

-- Angry Mood
('Break Stuff — Limp Bizkit', 'Angry', '/assets/previews/break-stuff.mp3', '/assets/covers/limp.jpg'),
('In the End — Linkin Park', 'Angry', '/assets/previews/in-the-end.mp3', '/assets/covers/linkin-park.jpg'),
('Killing In The Name — Rage Against The Machine', 'Angry', '/assets/previews/killing-in-the-name.mp3', '/assets/covers/rage.jpg'),

-- Relaxed Mood
('Weightless — Marconi Union', 'Relaxed', '/assets/previews/weightless.mp3', '/assets/covers/marconi.jpg'),
('Clair de Lune — Claude Debussy', 'Relaxed', '/assets/previews/clair-de-lune.mp3', '/assets/covers/debussy.jpg'),
('River Flows In You — Yiruma', 'Relaxed', '/assets/previews/river-flows.mp3', '/assets/covers/yiruma.jpg'),

-- Excited Mood
('Can\'t Stop the Feeling — Justin Timberlake', 'Excited', '/assets/previews/cant-stop-the-feeling.mp3', '/assets/covers/justin.jpg'),
('Shut Up and Dance — Walk The Moon', 'Excited', '/assets/previews/shut-up-and-dance.mp3', '/assets/covers/walk-the-moon.jpg'),

-- Energetic Mood
('Blinding Lights — The Weeknd', 'Energetic', '/assets/previews/blinding-lights.mp3', '/assets/covers/weeknd.jpg'),
('Thunder — Imagine Dragons', 'Energetic', '/assets/previews/thunder.mp3', '/assets/covers/imagine-dragons.jpg'),
('Don\'t Stop Believin\' — Journey', 'Energetic', '/assets/previews/dont-stop-believin.mp3', '/assets/covers/journey.jpg'),

-- Romantic Mood
('Perfect — Ed Sheeran', 'Romantic', '/assets/previews/perfect.mp3', '/assets/covers/ed-sheeran.jpg'),
('All of Me — John Legend', 'Romantic', '/assets/previews/all-of-me.mp3', '/assets/covers/john-legend.jpg'),
('Thinking Out Loud — Ed Sheeran', 'Romantic', '/assets/previews/thinking-out-loud.mp3', '/assets/covers/ed-romantic.jpg'),

-- Night Mood
('Night Changes — One Direction', 'Night', '/assets/previews/night-changes.mp3', '/assets/covers/one-direction.jpg'),
('Midnight City — M83', 'Night', '/assets/previews/midnight-city.mp3', '/assets/covers/m83.jpg'),
('As The World Falls Down — David Bowie', 'Night', '/assets/previews/as-the-world-falls-down.mp3', '/assets/covers/bowie.jpg');

-- Verify the setup
SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as total_songs FROM songs;
SELECT mood, COUNT(*) as song_count FROM songs GROUP BY mood;
