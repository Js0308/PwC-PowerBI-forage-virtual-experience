# 🚀 Quick Start Guide

Get the Jama Masjid Phugewadi Admin Panel up and running in minutes!

## 📋 Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## ⚡ Automated Setup

### For Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

### For Windows:
```cmd
setup.bat
```

## 🛠️ Manual Setup

### 1. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jama-masjid-admin
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRE=30d
ADMIN_ID=jamamasjid
ADMIN_PASSWORD=786786
GOOGLE_SHEETS_SHEET_ID=1otUYpqsvKzX4APd1LX3EDgmbJSFqIiV1Dm7QxtsKqBU
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🏃‍♂️ Running the Application

### 1. Start MongoDB
```bash
mongod
```

### 2. Start Backend Server
```bash
cd backend
npm run dev
```

### 3. Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```

### 4. Open Browser
Navigate to: `http://localhost:3000`

## 🔐 Default Login

- **ID:** `jamamasjid`
- **Password:** `786786`

## 🌐 Google Sheets Integration

1. Make your Google Sheet public or "Anyone with the link can view"
2. Publish the sheet (File → Publish to the web → Publish)
3. Update `GOOGLE_SHEETS_SHEET_ID` in backend/.env
4. Expected columns: `First Name`, `Last Name`, `Mobile Number`, `Area`, `Notes`

## 📱 Features Available

### ✅ Currently Working
- **Login System** - Secure authentication
- **Dashboard** - Analytics and statistics
- **Master Data** - Donor management with CRUD operations
- **Search** - Find donors by mobile number or name
- **Google Sheets Import** - Bulk import donor data
- **Responsive Design** - Works on all devices

### 🔧 Coming Soon
- **Invoice Management** - Generate and track invoices
- **Receipt Management** - Create and manage receipts
- **Expense Tracking** - Monitor masjid expenses
- **PDF Generation** - Export documents
- **Advanced Analytics** - Detailed reporting

## 🎯 Quick Actions

Once logged in, you can:

1. **Add New Donor** - Click "Create Donor" button
2. **Search Donors** - Use search by mobile number or name
3. **Import Data** - Click "Import from Sheets" to bulk import
4. **View Analytics** - Check dashboard for statistics

## 🚨 Troubleshooting

### Common Issues:

1. **MongoDB not starting**
   ```bash
   # Create data directory
   mkdir -p /data/db
   sudo mongod
   ```

2. **Port already in use**
   ```bash
   # Kill processes using ports
   sudo lsof -ti:5000 | xargs kill -9
   sudo lsof -ti:3000 | xargs kill -9
   ```

3. **Dependencies not installing**
   ```bash
   # Clear npm cache
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📞 Support

- Check the main README.md for detailed documentation
- Review the API documentation in backend/README.md
- Contact the development team for issues

## 🎉 Success!

You should now have a fully functional Jama Masjid Admin Panel!

---

**Built with ❤️ for the Jama Masjid Phugewadi community**