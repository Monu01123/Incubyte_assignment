# Deployment Guide

This guide covers deploying both the backend and frontend of the Sweet Shop Management System.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Platform-Specific Guides](#platform-specific-guides)

## Prerequisites

- MongoDB database (MongoDB Atlas recommended for cloud)
- Git repository
- Node.js installed locally (for building)

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sweet-shop?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for all IPs, or specific IPs)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/sweet-shop`
6. Update `MONGODB_URI` in backend `.env`

## Backend Deployment

### Option 1: Railway (Recommended - Easy)

1. **Sign up** at [Railway.app](https://railway.app)
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Add Environment Variables:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Generate a strong secret key
   - `PORT` - Railway sets this automatically
   - `NODE_ENV=production`
5. **Configure Build:**
   - Root Directory: `backend`
   - Build Command: (leave empty, Railway auto-detects)
   - Start Command: `npm start`
6. **Deploy** - Railway will automatically deploy
7. **Get your backend URL** (e.g., `https://your-app.railway.app`)

### Option 2: Render

1. **Sign up** at [Render.com](https://render.com)
2. **New** → **Web Service**
3. **Connect GitHub** and select your repo
4. **Configure:**
   - Name: `sweet-shop-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables** (same as Railway)
6. **Deploy**
7. **Get your backend URL** (e.g., `https://sweet-shop-backend.onrender.com`)

### Option 3: Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create app:**
   ```bash
   cd backend
   heroku create sweet-shop-backend
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-uri"
   heroku config:set JWT_SECRET="your-jwt-secret"
   heroku config:set NODE_ENV="production"
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option 4: DigitalOcean App Platform

1. **Sign up** at [DigitalOcean](https://www.digitalocean.com)
2. **Create App** → **GitHub**
3. **Select repository** and branch
4. **Configure:**
   - Type: Web Service
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Run Command: `npm start`
5. **Add Environment Variables**
6. **Deploy**

## Frontend Deployment

### Option 1: Vercel (Recommended - Best for React)

1. **Sign up** at [Vercel.com](https://vercel.com)
2. **Import Project** → **GitHub**
3. **Select your repository**
4. **Configure:**
   - Framework Preset: `Vite`
   - Root Directory: (leave as root)
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add Environment Variable:**
   - `VITE_API_URL` - Your backend URL (e.g., `https://your-backend.railway.app/api`)
6. **Deploy**
7. **Get your frontend URL** (e.g., `https://sweet-shop.vercel.app`)

### Option 2: Netlify

1. **Sign up** at [Netlify.com](https://netlify.com)
2. **New site from Git** → **GitHub**
3. **Select repository**
4. **Configure:**
   - Base directory: (root)
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Add Environment Variable:**
   - `VITE_API_URL` - Your backend URL
6. **Deploy**

### Option 3: Render

1. **New** → **Static Site**
2. **Connect GitHub**
3. **Configure:**
   - Name: `sweet-shop-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. **Add Environment Variable:**
   - `VITE_API_URL`
5. **Deploy**

### Option 4: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/sweet-shop"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Update VITE_API_URL** to your backend URL

## Complete Deployment Steps

### Step 1: Prepare Backend

1. Ensure `backend/package.json` has:
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```

2. Create `backend/.env` with production variables

### Step 2: Deploy Backend

Choose a platform (Railway recommended) and follow the steps above.

**Note:** After deployment, get your backend URL (e.g., `https://sweet-shop-backend.railway.app`)

### Step 3: Update Frontend Environment

Update `VITE_API_URL` in frontend `.env`:
```env
VITE_API_URL=https://your-backend-url.com/api
```

### Step 4: Deploy Frontend

Choose a platform (Vercel recommended) and follow the steps above.

### Step 5: Create Admin User

After deployment, create an admin user:

**For Railway/Render:**
```bash
# SSH into your backend or use Railway CLI
cd backend
node scripts/createAdmin.js admin@example.com
```

**For Heroku:**
```bash
heroku run node scripts/createAdmin.js admin@example.com
```

## CORS Configuration

If you encounter CORS errors, update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.vercel.app',
    'https://your-frontend-url.netlify.app'
  ],
  credentials: true
}));
```

## Testing Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend-url.com/health
   ```

2. **Test Frontend:**
   - Visit your frontend URL
   - Try registering a new user
   - Test login functionality

## Troubleshooting

### Backend Issues

1. **Port not found:**
   - Ensure `PORT` is set in environment variables
   - Use `process.env.PORT || 3001` in server.js

2. **MongoDB connection failed:**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string format
   - Check database user credentials

3. **Build fails:**
   - Ensure all dependencies are in `package.json`
   - Check Node.js version compatibility

### Frontend Issues

1. **API calls fail:**
   - Verify `VITE_API_URL` is set correctly
   - Check CORS configuration in backend
   - Ensure backend URL includes `/api` prefix

2. **Build errors:**
   - Check for TypeScript errors
   - Verify all imports are correct
   - Check environment variables are prefixed with `VITE_`

## Production Checklist

- [ ] MongoDB database configured
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Admin user created
- [ ] SSL/HTTPS enabled (automatic on most platforms)
- [ ] Error logging configured
- [ ] Database backups enabled (MongoDB Atlas)

## Recommended Stack

- **Backend:** Railway or Render
- **Frontend:** Vercel
- **Database:** MongoDB Atlas
- **Domain:** (Optional) Connect custom domain via platform settings

## Support

For platform-specific issues, refer to:
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

