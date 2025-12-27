# Fresh Deployment Guide - Remove & Redeploy

## 🗑️ Step 1: Remove Current Deployment

### **Railway**

1. Go to https://railway.app
2. Log in to your account
3. Find your project
4. Click on the project
5. Click **"Settings"** (gear icon)
6. Scroll down to **"Danger Zone"**
7. Click **"Delete Project"** or **"Delete Service"**
8. Confirm deletion

**Alternative:** Delete the entire project from the dashboard

---

### **Render**

1. Go to https://render.com
2. Log in to your account
3. Go to **Dashboard**
4. Find your service
5. Click on the service
6. Go to **"Settings"** tab
7. Scroll to bottom
8. Click **"Delete Service"**
9. Type the service name to confirm
10. Click **"Delete"**

---

### **Vercel**

1. Go to https://vercel.com
2. Log in to your account
3. Go to **Dashboard**
4. Find your project
5. Click on the project
6. Go to **"Settings"** tab
7. Scroll to **"Danger Zone"**
8. Click **"Delete Project"**
9. Type project name to confirm
10. Click **"Delete"**

---

### **Heroku**

```bash
# Delete app
heroku apps:destroy your-app-name

# Or via dashboard:
# 1. Go to https://dashboard.heroku.com
# 2. Select your app
# 3. Settings → Delete app
```

---

## 🧹 Step 2: Clean Up Local Files (Optional)

If you want to start completely fresh locally:

```bash
# Remove node_modules (will reinstall later)
rm -rf node_modules

# Remove package-lock.json (optional)
rm package-lock.json

# Make sure .env is NOT committed
# Check .gitignore has .env (it already does)
```

---

## ✅ Step 3: Verify .gitignore

Make sure your `.gitignore` includes:

```
.env
node_modules/
uploads/
*.log
```

**✅ Your `.gitignore` already has these!**

---

## 🚀 Step 4: Fresh Deployment

### **Backend Deployment (Railway/Render)**

1. **Push clean code to GitHub:**
   ```bash
   git add .
   git commit -m "Fresh deployment - removed .env"
   git push origin main
   ```

2. **Create new deployment:**
   - **Railway:** New Project → Deploy from GitHub → Select repo
   - **Render:** New → Web Service → Connect GitHub repo

3. **Set Environment Variables** (NOT as a file):
   - `MONGODB_URI` = `mongodb+srv://preston10:Prestonmugz2003@14tugi.zc1f8gw.mongodb.net/14Tugi?retryWrites=true&w=majority`
   - `JWT_SECRET` = `14tugi-secret-key-2024-change-this-in-production`
   - `PORT` = (auto-set, don't add)

4. **Wait for deployment to complete**

5. **Get your backend URL:**
   - Railway: `https://your-app.railway.app`
   - Render: `https://your-app.onrender.com`

---

### **Frontend Deployment (Vercel)**

1. **Update `api-config.js`** with your new backend URL:
   ```javascript
   window.API_BASE_URL = 'https://your-new-backend-url.railway.app/api';
   ```

2. **Commit and push:**
   ```bash
   git add api-config.js
   git commit -m "Update API config with new backend URL"
   git push origin main
   ```

3. **Deploy to Vercel:**
   - Go to https://vercel.com
   - New Project → Import GitHub repo
   - Deploy

---

## 📋 Pre-Deployment Checklist

Before deploying, verify:

- [ ] `.env` is in `.gitignore` ✅
- [ ] `.env` is NOT in Git (check with `git status`)
- [ ] All code is committed
- [ ] Environment variables are ready to set on hosting platform
- [ ] `api-config.js` will be updated with backend URL

---

## 🔒 Security Checklist

- [ ] `.env` file is NOT in repository
- [ ] Environment variables will be set on hosting platform (not as files)
- [ ] MongoDB password is secure
- [ ] JWT_SECRET is a strong random string
- [ ] Admin password is secure

---

## 🧪 Step 5: Test Deployment

After deployment:

1. **Test backend:**
   ```bash
   curl https://your-backend-url/api/health
   ```
   Should return: `{"status":"OK","message":"14 Tugi API is running"}`

2. **Test frontend:**
   - Open your deployed frontend URL
   - Try logging in at `upload.html`
   - Test uploading a beat

---

## 🆘 Troubleshooting

**Deployment fails:**
- Check environment variables are set correctly
- Check MongoDB connection string is valid
- Check logs in hosting platform dashboard

**Frontend can't connect to backend:**
- Verify `api-config.js` has correct backend URL
- Check CORS is enabled on backend
- Check backend is running

**Authentication fails:**
- Verify JWT_SECRET matches in backend environment variables
- Clear browser localStorage/sessionStorage
- Try logging in again

---

## 📝 Quick Commands

```bash
# Check what will be committed (should NOT show .env)
git status

# Remove .env from Git if it's tracked
git rm --cached .env

# Commit everything
git add .
git commit -m "Fresh deployment"

# Push to GitHub
git push origin main
```

---

## 🎯 Summary

1. ✅ Delete old deployment from hosting platform
2. ✅ Verify `.env` is in `.gitignore`
3. ✅ Remove `.env` from Git if tracked
4. ✅ Push clean code to GitHub
5. ✅ Create new deployment
6. ✅ Set environment variables on hosting platform (NOT as files)
7. ✅ Update `api-config.js` with new backend URL
8. ✅ Deploy frontend
9. ✅ Test everything

---

**You're ready for a fresh, secure deployment! 🚀**

