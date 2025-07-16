#!/bin/bash

# Jama Masjid Phugewadi Admin Panel Setup Script
echo "🕌 Setting up Jama Masjid Phugewadi Admin Panel..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB v4.4 or higher."
    echo "   You can download it from: https://www.mongodb.com/try/download/community"
    echo ""
fi

# Backend setup
echo "🔧 Setting up backend..."
cd backend

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jama-masjid-admin
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRE=30d

# Google Sheets Integration
GOOGLE_SHEETS_API_KEY=your-google-sheets-api-key-here
GOOGLE_SHEETS_SHEET_ID=1otUYpqsvKzX4APd1LX3EDgmbJSFqIiV1Dm7QxtsKqBU

# Admin Credentials
ADMIN_ID=jamamasjid
ADMIN_PASSWORD=786786

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
EOL
    echo "✅ Created .env file with default values"
else
    echo "✅ .env file already exists"
fi

cd ..

# Frontend setup
echo ""
echo "🎨 Setting up frontend..."
cd frontend

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Check if .env.local file exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOL
    echo "✅ Created .env.local file"
else
    echo "✅ .env.local file already exists"
fi

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure MongoDB is running:"
echo "   mongod"
echo ""
echo "2. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open your browser and go to:"
echo "   http://localhost:3000"
echo ""
echo "🔐 Default login credentials:"
echo "   ID: jamamasjid"
echo "   Password: 786786"
echo ""
echo "🌐 Google Sheets Integration:"
echo "   Update the GOOGLE_SHEETS_SHEET_ID in backend/.env"
echo "   Make sure your Google Sheet is public or 'Anyone with the link can view'"
echo ""
echo "✨ Happy coding!"