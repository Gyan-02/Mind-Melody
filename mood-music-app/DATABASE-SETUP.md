# 🗄️ **DATABASE SETUP GUIDE**

## 📋 **Prerequisites**
- MySQL Server installed and running
- MySQL Workbench (recommended) or command line access

## 🚀 **Quick Setup**

### **Option 1: Using MySQL Workbench (Recommended)**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open the file `setup-database.sql`
4. Execute the entire script
5. Verify tables are created

### **Option 2: Using Command Line**
```bash
# If MySQL is in your PATH
mysql -u root -p < setup-database.sql

# Or connect first, then run
mysql -u root -p
source setup-database.sql;
```

### **Option 3: Manual Setup**
```sql
-- 1. Create database
CREATE DATABASE IF NOT EXISTS mind_melody;
USE mind_melody;

-- 2. Run the setup-database.sql file contents
```

## ⚙️ **Environment Configuration**

The `.env` file is already configured:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=mind_melody
PORT=3000
```

**Update the `.env` file if your MySQL settings are different:**
- Change `DB_PASS=your_password` if you have a MySQL password
- Change `DB_USER=your_username` if not using root
- Change `DB_HOST=your_host` if MySQL is on a different server

## 🧪 **Testing the Connection**

### **Start the Server**
```bash
# Use the batch file
start-server.bat

# Or run directly
node server.js
```

### **Check Connection Status**
Open: `http://localhost:3000/api/connection-status`

**Expected responses:**
- ✅ `{"connected": true}` - Database connected successfully
- ❌ `{"connected": false}` - Using in-memory storage (fallback)

## 📊 **Verify Database Setup**

### **Check Tables**
```sql
USE mind_melody;
SHOW TABLES;

-- Should show:
-- +----------------------+
-- | Tables_in_mind_melody|
-- +----------------------+
-- | mood_plays           |
-- | moods                |
-- | songs                |
-- +----------------------+
```

### **Check Sample Data**
```sql
SELECT COUNT(*) as total_songs FROM songs;
SELECT mood, COUNT(*) as song_count FROM songs GROUP BY mood;

-- Should show songs for all 8 moods:
-- Happy, Sad, Angry, Relaxed, Excited, Energetic, Romantic, Night
```

## 🎯 **Testing Mood Tracking**

1. **Open the app**: `http://localhost:3000`
2. **Click mood buttons** - should store data in `mood_plays` table
3. **Check database**:
   ```sql
   SELECT * FROM mood_plays ORDER BY played_at DESC LIMIT 10;
   ```

## 🔧 **Troubleshooting**

### **Common Issues:**

**❌ "MySQL init failed: connect ECONNREFUSED"**
- MySQL server is not running
- Start MySQL service: `net start mysql` (Windows)

**❌ "Access denied for user 'root'"**
- Update `.env` with correct password: `DB_PASS=your_password`

**❌ "Unknown database 'mind_melody'"**
- Run the `setup-database.sql` script first

**❌ "Cannot find module 'dotenv'"**
- Install dependencies: `npm install`

### **Fallback Mode**
If MySQL fails, the app automatically uses in-memory storage:
- ✅ App still works
- ❌ Data is lost when server restarts
- 💡 Fix database connection to persist data

## ✅ **Success Indicators**

When everything is working correctly:
```
🔌 Attempting to connect to MySQL database...
✅ MySQL connected successfully!
✅ Seeded songs table with 23 songs
✅ MySQL database initialized successfully with all tables!
Server running on http://localhost:3000
```

## 🎵 **Ready to Use!**

Once setup is complete:
- All mood interactions will be stored in MySQL
- Real song data will be loaded from the database
- Session tracking will work across browser sessions
- Database viewer will show live data

---
**Need help?** Check the console output for detailed error messages.
