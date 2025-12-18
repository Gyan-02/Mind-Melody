# 🎵 Mind Melody - Java Spring Boot Backend

This application now uses a **Java Spring Boot** backend instead of Node.js/Express.

## 🚀 Quick Start

### Prerequisites
- **Java 11** or higher
- **Maven** (for building the project)
- **MySQL** server running on localhost
- MySQL database named `mind_melody`

### Database Setup

1. **Start MySQL server**

2. **Create the database**:
```sql
CREATE DATABASE mind_melody;
```

The application will automatically create the necessary tables (`moods`, `mood_plays`, `songs`) on startup.

### Running the Backend

#### Option 1: Using Maven (Recommended)
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

#### Option 2: Using JAR file
```bash
cd backend
mvn clean package
java -jar target/mood-music-app-1.0-SNAPSHOT.jar
```

The server will start on **http://localhost:3000**

### Configuration

Edit `backend/src/main/resources/application.properties` to configure:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/mind_melody
spring.datasource.username=root
spring.datasource.password=

# Server Port
server.port=3000
```

## 📁 Project Structure

```
backend/
├── src/main/java/com/example/
│   ├── Main.java                    # Application entry point
│   ├── config/
│   │   ├── WebConfig.java          # Web configuration for static files
│   │   └── DataInitializer.java   # Seeds database with sample songs
│   ├── controller/
│   │   ├── MoodController.java     # /api/moods endpoints
│   │   └── SongController.java     # /api/songs endpoints
│   ├── model/
│   │   ├── Mood.java               # Mood entity
│   │   ├── MoodPlay.java          # Mood play tracking entity
│   │   └── Song.java              # Song entity
│   └── repository/
│       ├── MoodRepository.java     # Mood data access
│       ├── MoodPlayRepository.java # Mood play data access
│       └── SongRepository.java     # Song data access
└── pom.xml                         # Maven dependencies
```

## 🔌 API Endpoints

### Songs
- `GET /api/songs/{mood}` - Get songs by mood
- `POST /api/songs` - Get songs by mood (body: `{"mood": "Happy"}`)

### Moods
- `GET /api/moods` - Get all moods
- `POST /api/moods` - Add a new mood
- `POST /api/moods/track-play` - Track mood play (body: `{"moodType": "Happy", "songTitle": "...", "sessionId": "..."}`)
- `GET /api/moods/history` - Get recent mood plays (last 50)
- `GET /api/moods/stats` - Get mood statistics (last 30 days)

## 🎨 Frontend

The frontend is served from the `frontend/` directory and has been enhanced with:
- **Glassmorphism UI** - Modern glass-like effects
- **Smooth animations** - Floating, glowing, and shimmer effects
- **Enhanced gradients** - Beautiful neon color schemes
- **Improved hover states** - Better user interaction feedback
- **Responsive design** - Works great on all devices

Access the application at **http://localhost:3000** after starting the backend.

## 🔄 Migration from Node.js

The old Node.js backend (`server.js`) has been deprecated and renamed to `server.js.deprecated`.

**Key Changes:**
- ✅ All endpoints migrated to Java Spring Boot
- ✅ JPA/Hibernate for database operations
- ✅ Automatic database schema creation
- ✅ Data seeding on first startup
- ✅ Static file serving for frontend
- ✅ CORS enabled for API access

## 🧪 Testing

1. Start the backend
2. Open http://localhost:3000 in your browser
3. Click on mood buttons to test mood tracking
4. Use demo buttons to populate sample data
5. Check "View Database" to see stored data

## 📊 Database Schema

### moods table
- `id` - Auto-increment primary key
- `mood_type` - VARCHAR(100)
- `song_recommendation` - VARCHAR(255)
- `preview_url` - VARCHAR(255)
- `cover_url` - VARCHAR(255)
- `created_at` - TIMESTAMP

### mood_plays table
- `id` - Auto-increment primary key
- `mood_type` - VARCHAR(100)
- `song_title` - VARCHAR(255)
- `played_at` - TIMESTAMP
- `session_id` - VARCHAR(255)

### songs table
- `id` - Auto-increment primary key
- `title` - VARCHAR(255)
- `mood` - VARCHAR(80)
- `preview_url` - VARCHAR(255)
- `cover_url` - VARCHAR(255)

## 🛠️ Troubleshooting

### MySQL Connection Issues
- Ensure MySQL is running: `mysql -u root -p`
- Verify database exists: `SHOW DATABASES;`
- Check credentials in `application.properties`

### Port Already in Use
- Change port in `application.properties`
- Or stop the process using port 3000

### Build Errors
- Ensure Java 11+ is installed: `java -version`
- Ensure Maven is installed: `mvn -version`
- Clean and rebuild: `mvn clean install`

## 📝 Notes

- The backend automatically seeds the database with sample songs on first run
- All static frontend files are served from the backend
- The application uses JPA for database operations (no manual SQL queries needed)
- CORS is enabled for development purposes

---

**Enjoy your mood-based music experience! 🎧✨**
