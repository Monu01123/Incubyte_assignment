# Fix for "Invalid Version" Error on Render

## Problem
You're getting: `npm error Invalid Version:` when deploying on Render.

## Solution

The issue is usually caused by corrupted or incompatible `package-lock.json` files. Here's how to fix it:

### Option 1: Delete and Regenerate Lock Files (Recommended)

1. **Delete lock files locally:**
   ```bash
   # Delete backend lock file
   rm backend/package-lock.json
   
   # Delete frontend lock file  
   rm package-lock.json
   ```

2. **Regenerate them:**
   ```bash
   # Backend
   cd backend
   npm install
   cd ..
   
   # Frontend
   npm install
   ```

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Fix: Regenerate package-lock.json files"
   git push
   ```

4. **Redeploy on Render** - The build should work now.

### Option 2: Add .npmrc Files (Already Added)

I've added `.npmrc` files to both root and backend directories. These help npm handle dependencies better.

### Option 3: Update Render Build Settings

If the issue persists, try updating your Render build command:

**For Backend:**
```
rm -rf node_modules package-lock.json && npm install
```

**For Frontend:**
```
rm -rf node_modules package-lock.json && npm install && npm run build
```

### Option 4: Use npm ci Instead

Change build command to use `npm ci` (clean install):

**For Backend:**
```
npm ci
```

**For Frontend:**
```
npm ci && npm run build
```

## What I've Fixed

✅ Added `.npmrc` files to both root and backend  
✅ Added `engines` field to both `package.json` files  
✅ Updated frontend package name from "vite-react-typescript-starter" to "sweet-shop-frontend"  
✅ Updated frontend version from "0.0.0" to "1.0.0"

## Next Steps

1. **Delete and regenerate lock files** (Option 1 above)
2. **Commit and push** the changes
3. **Redeploy on Render**

The `.npmrc` and `engines` fields I added should prevent this issue in the future.

## If Still Not Working

Check the Render build logs for the exact error. Sometimes the issue is with a specific dependency. In that case:

1. Check which package is causing the issue in the logs
2. Update that package to a stable version
3. Regenerate lock files
4. Redeploy

