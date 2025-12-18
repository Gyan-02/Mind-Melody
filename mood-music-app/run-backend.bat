@echo off
setlocal

:: Load environment variables from .env file
if exist .env (
    for /f "tokens=*" %%i in (.env) do (
        for /f "tokens=1* delims==" %%a in ("%%i") do (
            if not "%%b"=="" set "%%a=%%b"
        )
    )
)

:: Set environment variables for Java
set "JAVA_OPTS=-DDB_HOST=%DB_HOST% -DDB_PORT=%DB_PORT% -DDB_NAME=%DB_NAME% -DDB_USER=%DB_USER% -DDB_PASSWORD=%DB_PASSWORD%"

:: Change to backend directory and run Maven
cd backend
mvn spring-boot:run

endlocal
