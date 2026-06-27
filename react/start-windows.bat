@echo off
title MyDR24 HOS - React App
cd /d "%~dp0"
color 0B
echo ==================================================
echo    MyDR24 HOS - Healthcare Operating System
echo    React (Vite + Tailwind) edition
echo ==================================================
echo.

REM --- Make sure we are NOT running from inside a ZIP ---
echo %CD% | find /i "Temp" >nul && (
  echo [WARNING] You may be running this from inside a ZIP file.
  echo Please EXTRACT the ZIP first ^(right-click the .zip -^> Extract All^),
  echo then open the extracted "react" folder and double-click this file again.
  echo.
)

REM --- Check Node.js is installed ---
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed on this PC.
  echo Download and install it from https://nodejs.org  ^(LTS version^),
  echo then double-click this file again.
  echo.
  pause
  exit /b 1
)

echo Node.js version:
node -v
echo.

REM --- Install dependencies on first run ---
if not exist "node_modules" (
  echo Installing dependencies for the first time...
  echo This downloads required packages and may take 1-2 minutes.
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
echo  Starting the app...
echo  When you see:   Local:  http://localhost:5173/
echo  hold CTRL and click that link (or paste it in your browser).
echo  To STOP the app later, press CTRL + C in this window.
echo ==================================================
echo.
call npm run dev

echo.
pause
