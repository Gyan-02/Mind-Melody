@echo off
echo.
echo 🎵 Starting Mind Melody Server...
echo.

REM Check if MySQL is running
echo 🔍 Checking MySQL connection...
echo.

REM Start the Node.js server
echo 🚀 Starting server on http://localhost:3000
echo.
echo ✅ Database will auto-connect if MySQL is available
echo 💡 If MySQL fails, app will use in-memory storage
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js

pause
