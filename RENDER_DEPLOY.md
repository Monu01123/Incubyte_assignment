# Deploy to Render - Step by Step Guide

This guide will help you deploy both backend and frontend to Render.

## Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster (takes 3-5 minutes)

2. **GitHub Repository**
   - Your code should be pushed to GitHub

3. **Render Account**
   - Sign up at [render.com](https://render.com) (free tier available)

---

## Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in
2. Click **"Build a Database"** → Select **"Free"** (M0)
3. Choose a cloud provider and region (closest to you)
4. Click **"Create"** (takes 3-5 minutes)

5. **Create Database User:**
   - Go to **"Database Access"** → **"Add New Database User"**
   - Username: `sweet-shop-user` (or your choice)
   - Password: Generate a strong password (save it!)
   - Database User Privileges: **"Read and write to any database"**
   - Click **"Add User"**

6. **Whitelist IP Address:**
   - Go to **"Network Access"** → **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - Click **"Confirm"**

7. **Get Connection String:**
   - Go to **"Database"** → Click **"Connect"** on your cluster
   - Select **"Connect your application"**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `sweet-shop` (or your database name)
   - Example: `mongodb+srv://sweet-shop-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/sweet-shop?retryWrites=true&w=majority`
   - **Save this string!** You'll need it for Render.

---

## Step 2: Deploy Backend on Render

### 2.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository
5. Click **"Connect"**

### 2.2 Configure Backend Service

Fill in the following:

- **Name:** `sweet-shop-backend` (or your choice)
- **Region:** Choose closest to you
- **Branch:** `main` (or your default branch)
- **Root Directory:** `backend`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 2.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/sweet-shop?retryWrites=true&w=majority
```
*(Replace with your actual MongoDB connection string)*

```
JWT_SECRET = your-super-secret-jwt-key-min-32-characters-long
```
*(Generate a random string, at least 32 characters)*

```
NODE_ENV = production
```

```
FRONTEND_URL = https://your-frontend-name.onrender.com
```
*(We'll update this after deploying frontend)*

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait for deployment to complete (2-5 minutes)
4. Once deployed, you'll get a URL like: `https://sweet-shop-backend.onrender.com`
5. **Test it:** Visit `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

### 2.5 Update FRONTEND_URL

After deploying frontend (Step 3), come back and update:
- Go to your backend service → **"Environment"** tab
- Update `FRONTEND_URL` to your frontend URL
- Click **"Save Changes"** (will auto-redeploy)

---

## Step 3: Deploy Frontend on Render

### 3.1 Create Static Site

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Select your repository
3. Click **"Connect"**

### 3.2 Configure Frontend

Fill in:

- **Name:** `sweet-shop-frontend` (or your choice)
- **Branch:** `main` (or your default branch)
- **Root Directory:** (leave empty - root)
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

### 3.3 Add Environment Variable

Click **"Add Environment Variable"**:

```
VITE_API_URL = https://your-backend-url.onrender.com/api
```
*(Replace with your actual backend URL from Step 2.4)*

**Important:** Make sure to include `/api` at the end!

### 3.4 Deploy

1. Click **"Create Static Site"**
2. Render will build and deploy (3-5 minutes)
3. Once deployed, you'll get a URL like: `https://sweet-shop-frontend.onrender.com`

---

## Step 4: Update Backend CORS

1. Go back to your backend service on Render
2. Click **"Environment"** tab
3. Update `FRONTEND_URL` to your frontend URL: `https://sweet-shop-frontend.onrender.com`
4. Click **"Save Changes"**
5. Wait for redeployment (1-2 minutes)

---

## Step 5: Create Admin User

After both services are deployed:

1. Go to your backend service on Render
2. Click **"Shell"** tab (or use Render CLI)
3. Run:
   ```bash
   cd backend
   node scripts/createAdmin.js admin@example.com
   ```
4. Replace `admin@example.com` with your email
5. You'll need to register this email first through the frontend, then run this command

**Alternative: Using Render CLI**

1. Install Render CLI: `npm install -g render-cli`
2. Login: `render login`
3. Run command:
   ```bash
   render exec sweet-shop-backend -- node scripts/createAdmin.js admin@example.com
   ```

---

## Step 6: Test Your Deployment

1. **Test Backend:**
   - Visit: `https://your-backend.onrender.com/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Frontend:**
   - Visit: `https://your-frontend.onrender.com`
   - Should see the login page

3. **Test Full Flow:**
   - Register a new user
   - Login
   - Browse sweets
   - Add to cart
   - Create order

---

## Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**
- Check MongoDB Atlas IP whitelist (should have `0.0.0.0/0`)
- Verify connection string format
- Check username/password in connection string

**"Port already in use"**
- Render automatically sets PORT, your code should use `process.env.PORT || 3001`
- ✅ Already configured in `server.js`

**"Build failed"**
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility

### Frontend Issues

**"API calls failing / CORS errors"**
- Verify `VITE_API_URL` includes `/api` at the end
- Check `FRONTEND_URL` in backend environment variables
- Ensure backend CORS is configured correctly

**"Blank page after deployment"**
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Check build logs for errors

**"404 on routes"**
- This is normal for React Router on static sites
- Render should handle this automatically, but if not:
  - Go to Static Site settings
  - Add redirect rule: `/* /index.html 200`

### Common Render Issues

**"Service sleeping" (Free tier)**
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- Consider upgrading to paid plan for always-on service

**"Build timeout"**
- Free tier has 10-minute build timeout
- If build takes longer, optimize dependencies or upgrade

---

## Environment Variables Summary

### Backend (Web Service)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
FRONTEND_URL=https://your-frontend.onrender.com
```

### Frontend (Static Site)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Next Steps

1. ✅ Both services deployed
2. ✅ Admin user created
3. ⏳ Test all functionality
4. ⏳ (Optional) Add custom domain
5. ⏳ (Optional) Set up monitoring

---

## Custom Domain (Optional)

1. Go to your service → **"Settings"** → **"Custom Domains"**
2. Add your domain
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

---

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

---

## Quick Reference

**Backend URL:** `https://sweet-shop-backend.onrender.com`  
**Frontend URL:** `https://sweet-shop-frontend.onrender.com`  
**Health Check:** `https://sweet-shop-backend.onrender.com/health`  
**API Base:** `https://sweet-shop-backend.onrender.com/api`

