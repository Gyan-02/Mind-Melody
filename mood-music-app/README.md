# 🎧 Mind Melody - Mood Music App

## Overview
Mind Melody is a beautiful, modern web application that provides personalized music recommendations based on your current mood. The application features a stunning glassmorphism UI with smooth animations and is powered by a robust Java Spring Boot backend with MySQL database integration.

## 🚀 Project Structure

```
mood-music-app/
├── backend/                    # Java Spring Boot backend
│   ├── src/                   # Source code
│   │   └── main/
│   │       ├── java/com/example/
│   │       │   ├── config/    # Configuration classes
│   │       │   ├── controller/# REST controllers
│   │       │   ├── model/     # JPA entities
│   │       │   ├── repository/# Data repositories
│   │       │   └── util/      # Utility classes
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml                # Maven configuration
│
├── mind-melody-react/         # React frontend (Vite + React + TypeScript)
│   ├── public/                # Static files
│   ├── src/                   # Source files
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React context providers
│   │   └── App.tsx            # Main App component
│   ├── index.html             # Main HTML file
│   ├── vite.config.ts         # Vite configuration
│   └── package.json           # Frontend dependencies
│
├── .env                       # Backend environment variables
├── run-backend.bat            # Script to start the backend
├── run-frontend.bat           # Script to start the frontend
└── setup-database.sql         # Database schema
```

## 🛠️ Prerequisites

- Java 17 or higher
- Node.js 16+ and npm 8+
- MySQL 8.0+
- Maven 3.8+

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mind-melody.git
   cd mind-melody
   ```

2. **Set up the database**
   - Start MySQL server
   - Create a new database:
     ```sql
     CREATE DATABASE mind_melody;
     ```
   - Import the schema:
     ```bash
     mysql -u root -p mind_melody < setup-database.sql
     ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` and update with your database credentials
   - Configure the frontend `.env` in `mind-melody-react/.env`

4. **Start the backend**
   ```bash
   run-backend.bat
   ```
   The API will be available at `http://localhost:3000`

5. **Start the frontend** (in a new terminal)
   ```bash
   run-frontend.bat
   ```
   The app will be available at `http://localhost:5173`

## 🔧 Configuration

### Backend (`.env`)
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mind_melody
DB_USER=root
DB_PASSWORD=your_password
SERVER_PORT=3000
```

### Frontend (`mind-melody-react/.env`)
```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Mind Melody
```

## 🛠 Development

### Backend
- Build: `mvn clean install`
- Run: `mvn spring-boot:run`
- API Docs: `http://localhost:3000/swagger-ui.html` (if enabled)

### Frontend
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build for production: `npm run build`

## 📚 API Endpoints

- `GET /api/moods` - Get all moods
- `POST /api/moods/select` - Select a mood
- `GET /api/songs` - Get recommended songs
- `GET /api/history` - Get mood history

## 🐛 Troubleshooting

- **Backend won't start**: Check if MySQL is running and the database credentials are correct
- **Frontend can't connect to backend**: Make sure the backend is running and the `VITE_API_URL` is correct
- **Database connection issues**: Verify MySQL is running and the database exists

## 📄 License

This project is licensed under the MIT License.
│           │       └── example
│           │           ├── Main.java
│           │           ├── controller
│           │           │   └── MoodController.java
│           │           ├── dao
│           │           │   └── MoodDao.java
│           │           ├── model
│           │           │   └── Mood.java
│           │           └── util
│           │               └── Database.java
│           └── resources
│               └── application.properties
├── db
│   └── schema.sql
├── .gitignore
└── README.md
```

## ✨ Features

### Frontend
- 🎨 **Beautiful Glassmorphism UI** - Modern glass-like effects with backdrop blur
- 🌈 **Vibrant Gradient Colors** - Eye-catching neon color schemes
- ✨ **Smooth Animations** - Floating, glowing, and shimmer effects
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🎵 **8 Mood Categories** - Happy, Sad, Angry, Relaxed, Energetic, Excited, Romantic, Night
- 🎼 **Mini Player** - Fixed bottom player with controls
- 🔍 **Search Functionality** - Search for songs and artists

### Backend (Java Spring Boot)
- 🚀 **RESTful API** - Clean and well-structured endpoints
- 💾 **MySQL Database** - Persistent data storage
- 📊 **Mood Tracking** - Track user mood selections and song plays
- 📈 **Analytics** - View mood statistics and play history
- 🔄 **Auto Data Seeding** - Automatically populates sample songs on first run
- 🌐 **CORS Enabled** - Ready for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- **Java 11+** - [Download Java](https://www.oracle.com/java/technologies/downloads/)
- **Maven** - [Download Maven](https://maven.apache.org/download.cgi)
- **MySQL Server** - [Download MySQL](https://dev.mysql.com/downloads/mysql/)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd mood-music-app
   ```

2. **Set up the MySQL database:**
   ```sql
   CREATE DATABASE mind_melody;
   ```
   
   The application will automatically create tables on first run.

3. **Configure database connection:**
   - Edit `backend/src/main/resources/application.properties`
   - Update MySQL username/password if needed:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```

4. **Run the backend (Windows):**
   ```bash
   run-backend.bat
   ```
   
   **Or manually:**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

5. **Access the application:**
   - Open your browser and navigate to: **http://localhost:3000**
   - The frontend is automatically served by the Java backend

## 💡 Usage

1. **Select Your Mood:**
   - Click on one of the 8 mood buttons (😄 Happy, 😢 Sad, 😡 Angry, etc.)
   - The UI will highlight your selection with a beautiful glow effect

2. **Get Song Recommendations:**
   - View personalized song suggestions based on your mood
   - Songs are automatically loaded from the database

3. **Play Music:**
   - Click "Play Mood Mix" to start listening
   - Use the mini player at the bottom to control playback

4. **Track Your Moods:**
   - All mood selections are automatically tracked in the database
   - View your mood history using the "View Database" button

5. **Test with Demo Data:**
   - Use the demo buttons to populate sample mood data
   - Click "Populate All Sample Data" to seed the database

## 📚 Documentation

- **[JAVA_BACKEND_README.md](JAVA_BACKEND_README.md)** - Detailed backend documentation
- **[DATABASE-SETUP.md](DATABASE-SETUP.md)** - Database setup guide
- **[TESTING-GUIDE.md](TESTING-GUIDE.md)** - Testing instructions

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.