# 🚀 Deployment Guide - Fixing Vercel Errors

This guide will help you fix common Vercel deployment errors and successfully deploy the Jama Masjid Admin Panel.

## 🔧 Common Vercel Errors & Fixes

### 1. **FUNCTION_INVOCATION_TIMEOUT** (504)
**Fix:** Functions running too long
```json
// In vercel.json
{
  "functions": {
    "*.js": {
      "maxDuration": 30
    }
  }
}
```

### 2. **DEPLOYMENT_NOT_READY_REDIRECTING** (303)
**Fix:** Build errors during deployment
- Check build logs in Vercel dashboard
- Fix TypeScript errors
- Ensure all dependencies are installed

### 3. **FUNCTION_INVOCATION_FAILED** (500)
**Fix:** Runtime errors in functions
- Check environment variables
- Verify database connection
- Review function logs

### 4. **TOO_MANY_FILESYSTEM_CHECKS** (502)
**Fix:** Routing configuration issues
- Simplify API routes
- Use proper Next.js routing

## 📦 Pre-Deployment Checklist

### ✅ **Frontend Deployment (Vercel)**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Build Test:**
```bash
cd frontend
npm run build
```

3. **Environment Variables:**
Set in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

4. **Deploy:**
```bash
vercel --prod
```

### ✅ **Backend Deployment (Vercel)**

1. **Environment Variables:**
Set in Vercel dashboard:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRE=30d
ADMIN_ID=jamamasjid
ADMIN_PASSWORD=786786
GOOGLE_SHEETS_SHEET_ID=1otUYpqsvKzX4APd1LX3EDgmbJSFqIiV1Dm7QxtsKqBU
```

2. **Deploy:**
```bash
cd backend
vercel --prod
```

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
- Go to [MongoDB Atlas](https://cloud.mongodb.com/)
- Create free cluster
- Create database user
- Whitelist all IPs (0.0.0.0/0) for serverless

### 2. Get Connection String
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/jama-masjid-admin?retryWrites=true&w=majority
```

## 🔄 Step-by-Step Deployment

### **Option 1: Automatic Deployment (Recommended)**

1. **Fork/Clone Repository**
2. **Connect to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import Git Repository
   - Deploy both frontend and backend separately

3. **Configure Environment Variables:**
   - In Vercel project settings
   - Add all required variables

### **Option 2: Manual Deployment**

1. **Backend First:**
```bash
cd backend
vercel --prod
# Note the deployment URL
```

2. **Update Frontend Config:**
```bash
# Update .env.local
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

3. **Deploy Frontend:**
```bash
cd frontend
vercel --prod
```

## 🐛 Troubleshooting Common Issues

### **Build Errors**
```bash
# Fix TypeScript errors
npm run build

# Fix dependency issues
rm -rf node_modules package-lock.json
npm install
```

### **Database Connection Issues**
```javascript
// Check MongoDB connection
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});
```

### **CORS Errors**
```javascript
// Update CORS settings in server.js
app.use(cors({
  origin: [
    'https://your-frontend-url.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true,
}));
```

### **Function Timeout**
```json
// In vercel.json
{
  "functions": {
    "*.js": {
      "maxDuration": 30
    }
  }
}
```

## 🌐 Alternative Deployment Options

### **Netlify (Frontend)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

### **Railway (Backend)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway deploy
```

### **Render (Full Stack)**
- Create account on [Render](https://render.com/)
- Connect repository
- Deploy both services

## 🔑 Environment Variables Guide

### **Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

### **Backend (.env)**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d
ADMIN_ID=jamamasjid
ADMIN_PASSWORD=786786
GOOGLE_SHEETS_SHEET_ID=1otUYpqsvKzX4APd1LX3EDgmbJSFqIiV1Dm7QxtsKqBU
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## 📊 Monitoring & Debugging

### **Vercel Dashboard**
- Check function logs
- Monitor performance
- Review error traces

### **MongoDB Atlas**
- Monitor database connections
- Check query performance
- Review access logs

### **Health Check Endpoints**
```
GET /api/health
GET /
```

## 🔄 Post-Deployment Testing

1. **Test Authentication:**
```bash
curl -X POST https://your-api-url.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"id":"jamamasjid","password":"786786"}'
```

2. **Test Dashboard:**
```bash
curl https://your-api-url.vercel.app/api/dashboard/quick-stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

3. **Test Frontend:**
- Open deployed URL
- Try login
- Test donor creation
- Check Google Sheets import

## 🚨 Emergency Fixes

### **If deployment fails completely:**

1. **Rollback to previous version:**
```bash
vercel --prod --confirm
```

2. **Check logs:**
```bash
vercel logs
```

3. **Test locally first:**
```bash
npm run build
npm start
```

## 📞 Support

If you encounter specific errors:
1. Check Vercel dashboard logs
2. Review error messages
3. Compare with working local version
4. Contact support with error details

---

**Remember:** Always test locally before deploying to production!