public class Mood {
    private int id;
    private String moodType;
    private String songRecommendation;

    public Mood() {
    }

    public Mood(int id, String moodType, String songRecommendation) {
        this.id = id;
        this.moodType = moodType;
        this.songRecommendation = songRecommendation;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMoodType() {
        return moodType;
    }

    public void setMoodType(String moodType) {
        this.moodType = moodType;
    }

    public String getSongRecommendation() {
        return songRecommendation;
    }

    public void setSongRecommendation(String songRecommendation) {
        this.songRecommendation = songRecommendation;
    }
}