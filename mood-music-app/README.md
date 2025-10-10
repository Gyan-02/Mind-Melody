# Mood Music App

## Overview
The Mood Music App is a web application designed to collect user moods and provide song recommendations based on those moods. The application consists of a frontend built with HTML, CSS, and JavaScript, and a backend developed in Java using Spring Boot and JDBC for database management.

## Project Structure
```
mood-music-app
├── frontend
│   ├── index.html
│   ├── css
│   │   └── styles.css
│   └── js
│       └── app.js
├── backend
│   ├── pom.xml
│   └── src
│       └── main
│           ├── java
│           │   └── com
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

## Features
- User can submit their mood and receive a song recommendation.
- Data is stored in a relational database using JDBC.
- The application has a responsive frontend interface.

## Setup Instructions
1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd mood-music-app
   ```

2. **Set up the database:**
   - Run the SQL script located in `db/schema.sql` to create the necessary tables.

3. **Backend Setup:**
   - Navigate to the `backend` directory.
   - Build the project using Maven:
     ```
     mvn clean install
     ```
   - Run the application:
     ```
     mvn spring-boot:run
     ```

4. **Frontend Setup:**
   - Open `frontend/index.html` in a web browser to access the application.

## Usage
- Users can enter their mood in the provided input field and submit it.
- The application will display a song recommendation based on the submitted mood.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.