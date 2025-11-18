# Quick Deployment Guide

## Fastest Way to Deploy (5 minutes)

### Step 1: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Click **"Add Service"** → **"Empty Service"**
5. Click on the service → **"Settings"** → **"Root Directory"** → Set to `backend`
6. Go to **"Variables"** tab and add:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sweet-shop
   JWT_SECRET=generate-a-random-secret-key-here
   NODE_ENV=production
   ```
7. Railway will auto-deploy! Get your URL from **"Settings"** → **"Domains"**

### Step 2: Setup MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account → **"Build a Database"** → **"Free"**
3. Create cluster (takes 3-5 minutes)
4. Click **"Connect"** → **"Connect your application"**
5. Copy connection string
6. Replace `<password>` with your database password
7. Add database name: `sweet-shop` at the end
8. Update `MONGODB_URI` in Railway

### Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** (leave empty)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-url.railway.app/api`
6. Click **"Deploy"**

### Step 4: Create Admin User

After backend is deployed, run:
```bash
# Using Railway CLI
railway run node scripts/createAdmin.js admin@example.com

# Or SSH into Railway and run:
cd backend
node scripts/createAdmin.js admin@example.com
```

## Done! 🎉

Your app is live at:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-app.railway.app`

## Common Issues

**CORS Error?**
Update `backend/server.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true,
}));
```

**Can't connect to MongoDB?**
- Check IP whitelist in MongoDB Atlas (add `0.0.0.0/0` for all)
- Verify connection string format
- Check username/password

**Frontend can't reach backend?**
- Verify `VITE_API_URL` includes `/api` at the end
- Check backend is running (visit `/health` endpoint)
- Check CORS settings

