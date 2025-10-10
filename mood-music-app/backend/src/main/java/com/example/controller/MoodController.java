import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moods")
public class MoodController {

    @Autowired
    private MoodDao moodDao;

    @GetMapping
    public ResponseEntity<List<Mood>> getMoods() {
        List<Mood> moods = moodDao.getAllMoods();
        return ResponseEntity.ok(moods);
    }

    @PostMapping
    public ResponseEntity<Mood> addMood(@RequestBody Mood mood) {
        moodDao.saveMood(mood);
        return ResponseEntity.status(201).body(mood);
    }
}