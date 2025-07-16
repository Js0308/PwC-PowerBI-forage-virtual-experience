#!/bin/bash

# AI Image Generator Website Startup Script

echo "🎨 Starting AI Image Generator Website..."
echo "================================================="

# Create and activate virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
echo "Installing dependencies..."
pip install Flask Flask-CORS Pillow numpy

# Start the Flask application
echo "Starting Flask application..."
echo "📡 Server will be available at: http://localhost:5000"
echo "🛑 Press Ctrl+C to stop the server"
echo "================================================="

python app.py