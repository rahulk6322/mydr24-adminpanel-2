@echo off
title MyDR24 Admin Panel
cd /d "%~dp0"
color 0B
echo ==================================================
echo    MyDR24 - Healthcare Super Admin Panel (React)
echo ==================================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed.
  echo Install it from https://nodejs.org  ^(LTS version^), then run this again.
  echo.
  pause
  exit /b 1
)
echo Node.js version:
node -v
echo.
if not exist "node_modules" (
  echo Installing dependencies for the first time ^(1-2 minutes^)...
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
) else (
  echo Dependencies already installed - skipping.
)
echo.
echo ==================================================
echo  Starting... when you see  http://localhost:5173/
echo  it will open in your browser automatically.
echo  Press CTRL + C here to stop.
echo ==================================================
echo.
call npm run dev
pause
