# 🚀 Deploy Jama Masjid Admin Panel to Vercel

This guide will help you deploy your Jama Masjid Admin Panel to Vercel for a live preview.

## Prerequisites

1. **Vercel Account**: Create a free account at [vercel.com](https://vercel.com)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Deploy Backend

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. Set the **Root Directory** to `backend`
4. Set the **Framework Preset** to `Other`
5. Click **Deploy**

### Step 2: Deploy Frontend

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the same repository
3. Set the **Root Directory** to `frontend`
4. Set the **Framework Preset** to `Next.js`
5. Add Environment Variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.vercel.app/api` (replace with your backend URL)
6. Click **Deploy**

## Option 2: Deploy via Command Line

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy Backend

```bash
cd backend
vercel --prod
```

### Step 4: Deploy Frontend

```bash
cd ../frontend
# Update API URL in .env.local
echo "NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api" > .env.local
vercel --prod
```

## Option 3: One-Click Deploy (Automated)

### Step 1: Fork/Clone Repository

1. Fork this repository to your GitHub account
2. Clone it to your local machine

### Step 2: Deploy Backend

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fjama-masjid-admin-panel&project-name=jama-masjid-backend&repository-name=jama-masjid-backend&root-directory=backend)

### Step 3: Deploy Frontend

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fjama-masjid-admin-panel&project-name=jama-masjid-frontend&repository-name=jama-masjid-frontend&root-directory=frontend&env=NEXT_PUBLIC_API_URL&envDescription=API%20URL%20for%20backend&envLink=https%3A%2F%2Fgithub.com%2Fyour-username%2Fjama-masjid-admin-panel%2Fblob%2Fmain%2FREADME.md)

## Quick Deploy Script

If you have Vercel CLI installed and logged in, you can use this script:

```bash
# Make script executable
chmod +x deploy-vercel.sh

# Run deployment
./deploy-vercel.sh
```

## Expected URLs

After deployment, you'll get URLs like:
- **Backend**: `https://jama-masjid-backend.vercel.app`
- **Frontend**: `https://jama-masjid-frontend.vercel.app`

## Login Credentials

- **Username**: `jamamasjid`
- **Password**: `786786`

## Important Notes

### 1. Database Connection
The backend uses MongoDB. For production, you'll need to:
- Set up a MongoDB Atlas account (free tier available)
- Add connection string to environment variables in Vercel dashboard

### 2. Environment Variables

Add these to your Vercel backend project:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jamamasjid
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

Add this to your Vercel frontend project:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

### 3. CORS Configuration

The backend is already configured to allow all origins for development. For production, you might want to restrict this to your domain.

### 4. First Load

The backend might take a few seconds to "cold start" on first access. This is normal for serverless functions.

## Troubleshooting

### Build Errors

If you encounter build errors:

1. **Check Dependencies**: Ensure all packages are installed
2. **Environment Variables**: Make sure all required env vars are set
3. **Node Version**: Vercel uses Node 18 by default

### Database Connection Issues

1. **MongoDB Atlas**: Make sure your IP is whitelisted
2. **Connection String**: Check format and credentials
3. **Network**: Ensure database accepts connections from 0.0.0.0/0

### API Connection Issues

1. **CORS**: Check if frontend and backend are on different domains
2. **HTTPS**: Ensure both frontend and backend use HTTPS
3. **Environment Variables**: Verify API URL is correct

## Success Indicators

After successful deployment:

✅ Backend responds to `https://your-backend-url.vercel.app/api/health`
✅ Frontend loads at `https://your-frontend-url.vercel.app`
✅ Login page is accessible
✅ Authentication works with provided credentials

## Need Help?

If you encounter issues:

1. Check Vercel deployment logs in the dashboard
2. Verify all environment variables are set correctly
3. Test API endpoints individually
4. Check browser console for frontend errors

---

🎉 Once deployed, you'll have a live preview of your Jama Masjid Admin Panel accessible from anywhere!