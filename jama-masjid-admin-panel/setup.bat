@echo off
echo 🕌 Setting up Jama Masjid Phugewadi Admin Panel...
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14 or higher.
    echo    You can download it from: https://nodejs.org/
    pause
    exit /b 1
)

:: Check if MongoDB is installed
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB is not installed. Please install MongoDB v4.4 or higher.
    echo    You can download it from: https://www.mongodb.com/try/download/community
    echo.
)

:: Backend setup
echo 🔧 Setting up backend...
cd backend

:: Install backend dependencies
echo 📦 Installing backend dependencies...
call npm install

:: Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/jama-masjid-admin
        echo JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
        echo JWT_EXPIRE=30d
        echo.
        echo # Google Sheets Integration
        echo GOOGLE_SHEETS_API_KEY=your-google-sheets-api-key-here
        echo GOOGLE_SHEETS_SHEET_ID=1otUYpqsvKzX4APd1LX3EDgmbJSFqIiV1Dm7QxtsKqBU
        echo.
        echo # Admin Credentials
        echo ADMIN_ID=jamamasjid
        echo ADMIN_PASSWORD=786786
        echo.
        echo # Rate Limiting
        echo RATE_LIMIT_WINDOW_MS=900000
        echo RATE_LIMIT_MAX=100
    ) > .env
    echo ✅ Created .env file with default values
) else (
    echo ✅ .env file already exists
)

cd ..

:: Frontend setup
echo.
echo 🎨 Setting up frontend...
cd frontend

:: Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install

:: Check if .env.local file exists
if not exist .env.local (
    echo 📝 Creating .env.local file...
    echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
    echo ✅ Created .env.local file
) else (
    echo ✅ .env.local file already exists
)

cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Make sure MongoDB is running:
echo    mongod
echo.
echo 2. Start the backend server:
echo    cd backend ^&^& npm run dev
echo.
echo 3. In a new terminal, start the frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo 4. Open your browser and go to:
echo    http://localhost:3000
echo.
echo 🔐 Default login credentials:
echo    ID: jamamasjid
echo    Password: 786786
echo.
echo 🌐 Google Sheets Integration:
echo    Update the GOOGLE_SHEETS_SHEET_ID in backend/.env
echo    Make sure your Google Sheet is public or 'Anyone with the link can view'
echo.
echo ✨ Happy coding!
pause