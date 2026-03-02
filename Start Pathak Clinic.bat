@echo off
title Pathak Clinic
cd /d "%~dp0"

echo ============================================
echo    Pathak Clinic - Starting...
echo ============================================
echo.

if not exist "node_modules" (
    echo First time setup: Installing dependencies. This may take a few minutes...
    echo.
    call npm run install-all
    if errorlevel 1 (
        echo.
        echo Installation failed. Make sure Node.js is installed from https://nodejs.org
        pause
        exit /b 1
    )
    echo.
)

if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    call npm install --prefix backend
)

if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    call npm install --prefix frontend
)

echo.
echo Starting backend and frontend...
echo.
echo When both are ready, open your browser to:  http://localhost:3000
echo.
echo Press Ctrl+C in this window to stop the application.
echo ============================================
echo.

npm start

echo.
echo Application stopped.
pause
