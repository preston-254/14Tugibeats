# Deploy Backend to Railway - Step by Step Guide

## 🚂 Railway Backend Deployment

### **Step 1: Prepare Your Code**

1. **Make sure `.env` is NOT committed:**
   ```bash
   # Check if .env is tracked
   git status
   
   # If .env shows up, remove it
   git rm --cached .env
   git commit -m "Remove .env file"
   ```

2. **Verify `.gitignore` includes `.env`** ✅ (it already does)

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push origin main
   ```

---

### **Step 2: Create Railway Account**

1. Go to https://railway.app
2. Click **"Start a New Project"** or **"Login"**
3. Sign up with **GitHub** (recommended - easier to connect repos)
4. Authorize Railway to access your GitHub

---

### **Step 3: Deploy from GitHub**

1. **In Railway Dashboard:**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your repository (`14 Tugi` or whatever it's named)
   - Railway will automatically detect it's a Node.js project

2. **Railway will:**
   - Clone your repository
   - Install dependencies (`npm install`)
   - Start your server (`npm start`)

---

### **Step 4: Set Environment Variables**

**⚠️ IMPORTANT: Set these in Railway, NOT as a file!**

1. **In Railway Dashboard:**
   - Click on your project
   - Click on the service (your backend)
   - Go to **"Variables"** tab

2. **Add these environment variables:**

   **Variable 1:**
   - **Name:** `MONGODB_URI`
   - **Value:** `mongodb+srv://preston10:Prestonmugz2003@14tugi.zc1f8gw.mongodb.net/14Tugi?retryWrites=true&w=majority`
   - Click **"Add"**

   **Variable 2:**
   - **Name:** `JWT_SECRET`
   - **Value:** `14tugi-secret-key-2024-change-this-in-production`
   - Click **"Add"**

   **Variable 3:**
   - **Name:** `PORT`
   - **Value:** `5000` (or leave empty - Railway sets this automatically)
   - Click **"Add"**

3. **Railway will automatically redeploy** when you add variables

---

### **Step 5: Configure Build Settings (If Needed)**

Railway usually auto-detects, but verify:

1. **Go to Settings tab:**
   - **Build Command:** `npm install` (or leave empty)
   - **Start Command:** `npm start` (or `node server.js`)
   - **Root Directory:** `/` (root of repo)

2. **If you have a `package.json` with scripts:**
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```
   Railway will use this automatically.

---

### **Step 6: Get Your Backend URL**

1. **In Railway Dashboard:**
   - Click on your service
   - Go to **"Settings"** tab
   - Scroll to **"Domains"** section
   - Railway automatically creates a domain like:
     - `your-app-name.up.railway.app`
   - **Copy this URL** (you'll need it for frontend)

2. **Or check the "Deployments" tab:**
   - Your URL will be shown there

**Your backend URL will be:**
```
https://your-app-name.up.railway.app
```

**Your API base URL will be:**
```
https://your-app-name.up.railway.app/api
```

---

### **Step 7: Test Your Backend**

1. **Health Check:**
   Open in browser:
   ```
   https://your-app-name.up.railway.app/api/health
   ```
   Should return: `{"status":"OK","message":"14 Tugi API is running"}`

2. **Test Beats Endpoint:**
   ```
   https://your-app-name.up.railway.app/api/beats
   ```
   Should return: `[]` (empty array if no beats yet)

---

### **Step 8: Update Frontend API Config**

Now update your frontend to use the Railway backend:

1. **Edit `api-config.js`:**
   ```javascript
   // Replace localhost with your Railway URL
   window.API_BASE_URL = 'https://your-app-name.up.railway.app/api';
   ```

2. **Commit and push:**
   ```bash
   git add api-config.js
   git commit -m "Update API config for Railway backend"
   git push origin main
   ```

3. **Redeploy frontend** (Vercel will auto-deploy if connected to GitHub)

---

### **Step 9: Create Admin User (First Time)**

After deployment, create the admin user:

**Option 1: Run locally (recommended)**
```bash
# Make sure your .env file has the Railway MongoDB URI
# Then run:
node scripts/createAdmin.js
```

**Option 2: Use Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run the script
railway run node scripts/createAdmin.js
```

---

## 📋 Railway Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] `.env` is NOT in repository
- [ ] Railway project created
- [ ] GitHub repo connected
- [ ] Environment variables set:
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `PORT` (optional)
- [ ] Deployment successful
- [ ] Backend URL obtained
- [ ] Health check works (`/api/health`)
- [ ] `api-config.js` updated with Railway URL
- [ ] Frontend redeployed
- [ ] Admin user created
- [ ] Test login on upload page

---

## 🔧 Troubleshooting

### **Deployment Fails:**

1. **Check Build Logs:**
   - Railway Dashboard → Deployments → Click on failed deployment
   - Check error messages

2. **Common Issues:**
   - Missing `package.json` → Make sure it exists
   - Wrong start command → Check `package.json` scripts
   - Environment variables missing → Add them in Variables tab
   - MongoDB connection fails → Check `MONGODB_URI` is correct

### **Backend Not Responding:**

1. **Check if service is running:**
   - Railway Dashboard → Check service status
   - Should show "Active"

2. **Check logs:**
   - Railway Dashboard → Deployments → View logs
   - Look for errors

3. **Verify environment variables:**
   - Make sure all variables are set correctly
   - No typos in variable names

### **CORS Issues:**

- Backend already has CORS enabled
- If issues persist, check `api-config.js` has correct URL
- Make sure URL includes `/api` at the end

### **MongoDB Connection Fails:**

1. **Check MongoDB Atlas:**
   - Network Access → Add `0.0.0.0/0` (allow all IPs)
   - Or add Railway's IP addresses

2. **Verify connection string:**
   - Check `MONGODB_URI` in Railway variables
   - Make sure password is correct
   - Make sure database name is correct

---

## 🎯 Quick Reference

**Railway Dashboard:**
- https://railway.app/dashboard

**Your Backend URL:**
- `https://your-app-name.up.railway.app`
- API: `https://your-app-name.up.railway.app/api`

**Environment Variables Location:**
- Railway Dashboard → Project → Service → Variables tab

**View Logs:**
- Railway Dashboard → Project → Service → Deployments → Click deployment → View logs

---

## 🚀 Next Steps After Deployment

1. ✅ Test backend health endpoint
2. ✅ Update `api-config.js` with Railway URL
3. ✅ Redeploy frontend
4. ✅ Create admin user
5. ✅ Test login on upload page
6. ✅ Test uploading a beat
7. ✅ Test uploading a poster

---

**Your backend is now live on Railway! 🎉**

