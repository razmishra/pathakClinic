#!/usr/bin/env bash
cd "$(dirname "$0")"

echo "============================================"
echo "   Pathak Clinic - Starting..."
echo "============================================"
echo ""

if [ ! -d "node_modules" ] || [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "First time setup: Installing dependencies. This may take a few minutes..."
    echo ""
    npm run install-all
    if [ $? -ne 0 ]; then
        echo ""
        echo "Installation failed. Make sure Node.js is installed (https://nodejs.org)"
        exit 1
    fi
    echo ""
fi

echo "Starting backend and frontend..."
echo ""
echo "When both are ready, open your browser to:  http://localhost:3000"
echo ""
echo "Press Ctrl+C in this terminal to stop the application."
echo "============================================"
echo ""

npm start
