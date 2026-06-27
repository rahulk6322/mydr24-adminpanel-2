#!/usr/bin/env bash
# MyDR24 HOS - React App launcher for macOS / Linux
# Usage: double-click (after `chmod +x start-mac-linux.sh`) or run: bash start-mac-linux.sh
set -e
cd "$(dirname "$0")"

echo "=================================================="
echo "   MyDR24 HOS - Healthcare Operating System"
echo "   React (Vite + Tailwind) edition"
echo "=================================================="
echo

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js is not installed."
  echo "Install it from https://nodejs.org (LTS), then run this again."
  exit 1
fi

echo "Node.js version: $(node -v)"
echo

if [ ! -d node_modules ]; then
  echo "Installing dependencies (first run, 1-2 minutes)..."
  npm install
else
  echo "Dependencies already installed - skipping."
fi

echo
echo "Starting the app... open the printed http://localhost:5173/ link."
echo "Press Ctrl+C to stop."
echo
npm run dev
