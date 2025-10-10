const express = require('express');
const path = require('path');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

let mysql;
try { mysql = require('mysql2/promise'); } catch(e){ mysql = null; }

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, 'frontend');

app.use(cors());
app.use(express.json());

// request logger
app.use((req,res,next)=>{ console.log(new Date().toISOString(), req.method, req.url); next(); });

// serve frontend static
app.use(express.static(FRONTEND_DIR, { index: 'index.html', extensions: ['html'], dotfiles: 'ignore' }));
console.log('Serving static from:', FRONTEND_DIR);

// in-memory seed and stores
const seedSongs = [
  // Happy Mood
  { title: 'Happy — Pharrell Williams', mood: 'Happy', preview: '/assets/previews/happy.mp3', cover: '/assets/covers/happy.jpg' },
  { title: 'Uptown Funk — Mark Ronson ft. Bruno Mars', mood: 'Happy', preview: '/assets/previews/uptown-funk.mp3', cover: '/assets/covers/uptown-funk.jpg' },
  { title: 'Shake It Off — Taylor Swift', mood: 'Happy', preview: '/assets/previews/shake-it-off.mp3', cover: '/assets/covers/taylor-swift.jpg' },

  // Sad Mood
  { title: 'Someone Like You — Adele', mood: 'Sad', preview: '/assets/previews/someone-like-you.mp3', cover: '/assets/covers/adele.jpg' },
  { title: 'All Too Well — Taylor Swift', mood: 'Sad', preview: '/assets/previews/all-too-well.mp3', cover: '/assets/covers/taylor-sad.jpg' },
  { title: 'When I Was Your Man — Bruno Mars', mood: 'Sad', preview: '/assets/previews/when-i-was-your-man.mp3', cover: '/assets/covers/bruno-sad.jpg' },

  // Angry Mood
  { title: 'Break Stuff — Limp Bizkit', mood: 'Angry', preview: '/assets/previews/break-stuff.mp3', cover: '/assets/covers/limp.jpg' },
  { title: 'In the End — Linkin Park', mood: 'Angry', preview: '/assets/previews/in-the-end.mp3', cover: '/assets/covers/linkin-park.jpg' },
  { title: 'Killing In The Name — Rage Against The Machine', mood: 'Angry', preview: '/assets/previews/killing-in-the-name.mp3', cover: '/assets/covers/rage.jpg' },

  // Relaxed Mood
  { title: 'Weightless — Marconi Union', mood: 'Relaxed', preview: '/assets/previews/weightless.mp3', cover: '/assets/covers/marconi.jpg' },
  { title: 'Clair de Lune — Claude Debussy', mood: 'Relaxed', preview: '/assets/previews/clair-de-lune.mp3', cover: '/assets/covers/debussy.jpg' },
  { title: 'River Flows In You — Yiruma', mood: 'Relaxed', preview: '/assets/previews/river-flows.mp3', cover: '/assets/covers/yiruma.jpg' },

  // Excited Mood
  { title: "Can't Stop the Feeling — Justin Timberlake", mood: 'Excited', preview: '/assets/previews/cant-stop-the-feeling.mp3', cover: '/assets/covers/justin.jpg' },
  { title: 'Shut Up and Dance — Walk The Moon', mood: 'Excited', preview: '/assets/previews/shut-up-and-dance.mp3', cover: '/assets/covers/walk-the-moon.jpg' },
  { title: 'Happy — Pharrell Williams', mood: 'Excited', preview: '/assets/previews/happy-excited.mp3', cover: '/assets/covers/pharrell-excited.jpg' },

  // Energetic Mood
  { title: 'Blinding Lights — The Weeknd', mood: 'Energetic', preview: '/assets/previews/blinding-lights.mp3', cover: '/assets/covers/weeknd.jpg' },
  { title: 'Thunder — Imagine Dragons', mood: 'Energetic', preview: '/assets/previews/thunder.mp3', cover: '/assets/covers/imagine-dragons.jpg' },
  { title: "Don't Stop Believin' — Journey", mood: 'Energetic', preview: '/assets/previews/dont-stop-believin.mp3', cover: '/assets/covers/journey.jpg' },

  // Romantic Mood
  { title: 'Perfect — Ed Sheeran', mood: 'Romantic', preview: '/assets/previews/perfect.mp3', cover: '/assets/covers/ed-sheeran.jpg' },
  { title: 'All of Me — John Legend', mood: 'Romantic', preview: '/assets/previews/all-of-me.mp3', cover: '/assets/covers/john-legend.jpg' },
  { title: 'Thinking Out Loud — Ed Sheeran', mood: 'Romantic', preview: '/assets/previews/thinking-out-loud.mp3', cover: '/assets/covers/ed-romantic.jpg' },

  // Night Mood
  { title: 'Night Changes — One Direction', mood: 'Night', preview: '/assets/previews/night-changes.mp3', cover: '/assets/covers/one-direction.jpg' },
  { title: 'Midnight City — M83', mood: 'Night', preview: '/assets/previews/midnight-city.mp3', cover: '/assets/covers/m83.jpg' },
  { title: 'As The World Falls Down — David Bowie', mood: 'Night', preview: '/assets/previews/as-the-world-falls-down.mp3', cover: '/assets/covers/bowie.jpg' }
];

let songsByMood = seedSongs.reduce((acc,s)=>{
  acc[s.mood]=acc[s.mood]||[];
  acc[s.mood].push(s);
  return acc;
},{});
let moodsStore = []; // saved selections - fallback when DB is not available
let dbPool = null;

async function initDbIfConfigured(){
  if (!mysql) {
    console.log('⚠️  MySQL not available - using in-memory storage');
    return;
  }
  
  console.log('🔌 Attempting to connect to MySQL database...');
  
  try {
    dbPool = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'mind_melody',
      waitForConnections: true,
      connectionLimit: 5,
      acquireTimeout: 60000,
      timeout: 60000
    });

    // Test the connection
    const connection = await dbPool.getConnection();
    console.log('✅ MySQL connected successfully!');
    connection.release();

    // Create tables
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS moods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mood_type VARCHAR(100) NOT NULL,
        song_recommendation VARCHAR(255),
        preview_url VARCHAR(255),
        cover_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_mood_type (mood_type),
        INDEX idx_created_at (created_at)
      )
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS mood_plays (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mood_type VARCHAR(100) NOT NULL,
        song_title VARCHAR(255),
        played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        session_id VARCHAR(255),
        INDEX idx_mood_plays (mood_type, played_at),
        INDEX idx_session (session_id)
      )
    `);

    // Drop and recreate songs table to ensure correct structure
    await dbPool.query('DROP TABLE IF EXISTS songs');
    await dbPool.query('CREATE TABLE songs (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), mood VARCHAR(80), preview_url VARCHAR(255), cover_url VARCHAR(255))');
    console.log('✅ Songs table recreated with correct structure');

    // Seed songs table
    const [rows] = await dbPool.query('SELECT COUNT(*) AS cnt FROM songs');
    const cnt = rows && rows[0] && rows[0].cnt ? Number(rows[0].cnt) : 0;
    if (cnt === 0) {
      const vals = seedSongs.map(s=>[s.title,s.mood,s.preview,s.cover]);
      await dbPool.query('INSERT INTO songs (title,mood,preview_url,cover_url) VALUES ?', [vals]);
      console.log('✅ Seeded songs table with', seedSongs.length, 'songs');
    }

    console.log('✅ MySQL database initialized successfully with all tables!');
  } catch(err){
    console.error('❌ MySQL init failed:', err.message);
    console.log('📝 Make sure MySQL is running and database "mind_melody" exists');
    console.log('💡 Using in-memory storage as fallback');
    dbPool = null;
  }
}

app.get('/api/connection-status', async (req,res)=>{
  if (!dbPool) return res.json({ connected: false });
  try { await dbPool.query('SELECT 1'); res.json({ connected: true }); } catch(e){ res.json({ connected:false, error: e.message }); }
});

app.get('/api/songs/:mood', async (req,res)=>{
  const mood = (req.params.mood||'').trim();
  try {
    if (dbPool) {
      const [rows] = await dbPool.query('SELECT title, preview_url AS preview, cover_url AS cover FROM songs WHERE mood = ?', [mood]);
      return res.json({ songs: rows });
    }
    return res.json({ songs: songsByMood[mood] || [] });
  } catch(err){
    console.error(err);
    res.status(500).json({ error:'server error' });
  }
});

app.get('/api/moods', async (req,res)=>{
  try {
    if (dbPool) {
      const [rows] = await dbPool.query('SELECT id, mood_type AS moodType, song_recommendation AS songRecommendation, preview_url AS preview, cover_url AS cover, created_at AS createdAt FROM moods ORDER BY created_at DESC');
      return res.json(rows);
    }
    return res.json(moodsStore.slice().reverse());
  } catch(err){
    console.error(err);
    res.status(500).json({ error:'server error' });
  }
});

app.get('/api/songs/:mood', async (req,res)=>{
  const { mood } = req.params;
  console.log('🎵 API Request for mood:', mood);
  
  if (!mood) return res.status(400).json({ error:'missing mood parameter' });
  
  try {
    if (dbPool) {
      console.log('📊 Using database for mood:', mood);
      const [rows] = await dbPool.query('SELECT title, preview_url AS preview, cover_url AS cover FROM songs WHERE mood = ?', [mood]);
      console.log('📊 Database returned:', rows.length, 'songs');
      return res.json({ songs: rows });
    }
    
    // Fallback to in-memory data
    console.log('💾 Using in-memory data for mood:', mood);
    const songs = songsByMood[mood] || [];
    console.log('💾 In-memory data has:', songs.length, 'songs');
    console.log('💾 Available moods:', Object.keys(songsByMood));
    return res.json({ songs: songs });
  } catch(err){
    console.error('❌ Error getting songs for mood:', mood, err);
    res.status(500).json({ error:'server error', details: err.message });
  }
});

app.post('/api/songs', async (req,res)=>{
  const { mood } = req.body || {};
  if (!mood) return res.status(400).json({ error:'missing mood' });
  try {
    if (dbPool) {
      const [rows] = await dbPool.query('SELECT title, preview_url AS preview, cover_url AS cover FROM songs WHERE mood = ?', [mood]);
      return res.json(rows);
    }
    return res.json(songsByMood[mood] || []);
  } catch(err){
    console.error(err);
    res.status(500).json({ error:'server error' });
  }
});

app.post('/api/moods/track-play', async (req,res)=>{
  const { moodType, songTitle, sessionId } = req.body || {};
  if (!moodType) return res.status(400).json({ error:'missing mood type' });
  try {
    if (dbPool) {
      await dbPool.query(
        'INSERT INTO mood_plays (mood_type, song_title, session_id) VALUES (?, ?, ?)',
        [moodType, songTitle || null, sessionId || null]
      );
      return res.json({ success: true, message: 'Mood play tracked' });
    }
    // Fallback to in-memory storage
    console.log(`Mood play tracked (in-memory): ${moodType} - ${songTitle || 'N/A'}`);
    return res.json({ success: true, message: 'Mood play tracked (in-memory)' });
  } catch(err){
    console.error('Error tracking mood play:', err);
    res.status(500).json({ error:'failed to track mood play' });
  }
});

app.get('/api/moods/stats', async (req,res)=>{
  try {
    if (dbPool) {
      const [rows] = await dbPool.query(`
        SELECT mood_type, COUNT(*) as play_count
        FROM mood_plays
        WHERE played_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY mood_type
        ORDER BY play_count DESC
      `);
      return res.json({ stats: rows });
    }
    // Fallback for in-memory (would need tracking implementation)
    return res.json({ stats: [], message: 'No database connection' });
  } catch(err){
    console.error('Error getting mood stats:', err);
    res.status(500).json({ error:'failed to get mood stats' });
  }
});

app.get('/api/moods/history', async (req,res)=>{
  try {
    if (dbPool) {
      const [rows] = await dbPool.query(`
        SELECT mood_type, song_title, played_at
        FROM mood_plays
        ORDER BY played_at DESC
        LIMIT 50
      `);
      return res.json({ history: rows });
    }
    return res.json({ history: moodsStore.slice().reverse().slice(0, 50) });
  } catch(err){
    console.error('Error getting mood history:', err);
    res.status(500).json({ error:'failed to get mood history' });
  }
});

// safe fallback: serve frontend index for client-side routes
app.use((req,res)=>{ res.sendFile(path.join(FRONTEND_DIR,'index.html')); });

initDbIfConfigured().then(()=> {
  app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
}).catch(err=>{
  console.error('Init failed:', err);
  app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
});