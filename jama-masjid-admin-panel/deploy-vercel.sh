#!/bin/bash

# Deploy Jama Masjid Admin Panel to Vercel

set -e

echo "🚀 Deploying Jama Masjid Admin Panel to Vercel..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

# Deploy Backend
print_status "🔧 Deploying Backend..."
cd backend
if npx vercel --prod --yes --name jama-masjid-backend; then
    print_success "✅ Backend deployed successfully!"
    BACKEND_URL=$(npx vercel --prod --name jama-masjid-backend 2>/dev/null | grep -o 'https://[^"]*' | head -1)
    if [[ -n $BACKEND_URL ]]; then
        print_success "🌐 Backend URL: $BACKEND_URL"
    else
        BACKEND_URL="https://jama-masjid-backend.vercel.app"
        print_success "🌐 Backend URL: $BACKEND_URL"
    fi
else
    print_error "❌ Backend deployment failed!"
    exit 1
fi

# Update frontend API URL
print_status "🔧 Updating frontend API URL..."
cd ../frontend
echo "NEXT_PUBLIC_API_URL=${BACKEND_URL}/api" > .env.local

# Build frontend with updated API URL
print_status "🔧 Building frontend..."
if npm run build; then
    print_success "✅ Frontend build successful!"
else
    print_error "❌ Frontend build failed!"
    exit 1
fi

# Deploy Frontend
print_status "🔧 Deploying Frontend..."
if npx vercel --prod --yes --name jama-masjid-frontend; then
    print_success "✅ Frontend deployed successfully!"
    FRONTEND_URL=$(npx vercel --prod --name jama-masjid-frontend 2>/dev/null | grep -o 'https://[^"]*' | head -1)
    if [[ -n $FRONTEND_URL ]]; then
        print_success "🌐 Frontend URL: $FRONTEND_URL"
    else
        FRONTEND_URL="https://jama-masjid-frontend.vercel.app"
        print_success "🌐 Frontend URL: $FRONTEND_URL"
    fi
else
    print_error "❌ Frontend deployment failed!"
    exit 1
fi

# Final message
print_success "
🎉 Deployment Complete!

📱 Frontend: $FRONTEND_URL
🔧 Backend: $BACKEND_URL

🔐 Login Credentials:
   Username: jamamasjid
   Password: 786786

📝 Note: The backend might take a few minutes to fully initialize on first access.
"