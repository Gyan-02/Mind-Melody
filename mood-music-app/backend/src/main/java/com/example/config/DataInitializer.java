package com.example.config;

import com.example.model.Song;
import com.example.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private SongRepository songRepository;

    @Override
    public void run(String... args) {
        // Only seed if database is empty
        if (songRepository.count() == 0) {
            List<Song> songs = Arrays.asList(
                // Happy Mood
                new Song(null, "Happy — Pharrell Williams", "Happy", "/assets/previews/happy.mp3", "/assets/covers/happy.jpg"),
                new Song(null, "Uptown Funk — Mark Ronson ft. Bruno Mars", "Happy", "/assets/previews/uptown-funk.mp3", "/assets/covers/uptown-funk.jpg"),
                new Song(null, "Shake It Off — Taylor Swift", "Happy", "/assets/previews/shake-it-off.mp3", "/assets/covers/taylor-swift.jpg"),

                // Sad Mood
                new Song(null, "Someone Like You — Adele", "Sad", "/assets/previews/someone-like-you.mp3", "/assets/covers/adele.jpg"),
                new Song(null, "All Too Well — Taylor Swift", "Sad", "/assets/previews/all-too-well.mp3", "/assets/covers/taylor-sad.jpg"),
                new Song(null, "When I Was Your Man — Bruno Mars", "Sad", "/assets/previews/when-i-was-your-man.mp3", "/assets/covers/bruno-sad.jpg"),

                // Angry Mood
                new Song(null, "Break Stuff — Limp Bizkit", "Angry", "/assets/previews/break-stuff.mp3", "/assets/covers/limp.jpg"),
                new Song(null, "In the End — Linkin Park", "Angry", "/assets/previews/in-the-end.mp3", "/assets/covers/linkin-park.jpg"),
                new Song(null, "Killing In The Name — Rage Against The Machine", "Angry", "/assets/previews/killing-in-the-name.mp3", "/assets/covers/rage.jpg"),

                // Relaxed Mood
                new Song(null, "Weightless — Marconi Union", "Relaxed", "/assets/previews/weightless.mp3", "/assets/covers/marconi.jpg"),
                new Song(null, "Clair de Lune — Claude Debussy", "Relaxed", "/assets/previews/clair-de-lune.mp3", "/assets/covers/debussy.jpg"),
                new Song(null, "River Flows In You — Yiruma", "Relaxed", "/assets/previews/river-flows.mp3", "/assets/covers/yiruma.jpg"),

                // Excited Mood
                new Song(null, "Can't Stop the Feeling — Justin Timberlake", "Excited", "/assets/previews/cant-stop-the-feeling.mp3", "/assets/covers/justin.jpg"),
                new Song(null, "Shut Up and Dance — Walk The Moon", "Excited", "/assets/previews/shut-up-and-dance.mp3", "/assets/covers/walk-the-moon.jpg"),
                new Song(null, "Happy — Pharrell Williams", "Excited", "/assets/previews/happy-excited.mp3", "/assets/covers/pharrell-excited.jpg"),

                // Energetic Mood
                new Song(null, "Blinding Lights — The Weeknd", "Energetic", "/assets/previews/blinding-lights.mp3", "/assets/covers/weeknd.jpg"),
                new Song(null, "Thunder — Imagine Dragons", "Energetic", "/assets/previews/thunder.mp3", "/assets/covers/imagine-dragons.jpg"),
                new Song(null, "Don't Stop Believin' — Journey", "Energetic", "/assets/previews/dont-stop-believin.mp3", "/assets/covers/journey.jpg"),

                // Romantic Mood
                new Song(null, "Perfect — Ed Sheeran", "Romantic", "/assets/previews/perfect.mp3", "/assets/covers/ed-sheeran.jpg"),
                new Song(null, "All of Me — John Legend", "Romantic", "/assets/previews/all-of-me.mp3", "/assets/covers/john-legend.jpg"),
                new Song(null, "Thinking Out Loud — Ed Sheeran", "Romantic", "/assets/previews/thinking-out-loud.mp3", "/assets/covers/ed-romantic.jpg"),

                // Night Mood
                new Song(null, "Night Changes — One Direction", "Night", "/assets/previews/night-changes.mp3", "/assets/covers/one-direction.jpg"),
                new Song(null, "Midnight City — M83", "Night", "/assets/previews/midnight-city.mp3", "/assets/covers/m83.jpg"),
                new Song(null, "As The World Falls Down — David Bowie", "Night", "/assets/previews/as-the-world-falls-down.mp3", "/assets/covers/bowie.jpg")
            );

            songRepository.saveAll(songs);
            System.out.println("✅ Seeded database with " + songs.size() + " songs");
        } else {
            System.out.println("✅ Database already contains songs, skipping seed");
        }
    }
}
