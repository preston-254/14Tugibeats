# Files to Deploy - 14 Tugi Website

## 📦 Complete File List for Deployment

### ✅ **Frontend Files (Deploy to Vercel/Netlify)**

These files go to your frontend hosting (Vercel, Netlify, etc.):

```
✅ index.html
✅ upload.html
✅ ticket-purchase.html
✅ ticket-viewer.html
✅ styles.css
✅ script.js
✅ piano.js
✅ piano-features.js
✅ api.js
✅ api-config.js
✅ images/ (entire folder with all images)
```

**Total: 10 files + images folder**

---

### ✅ **Backend Files (Deploy to Railway/Render/Heroku)**

These files go to your backend hosting:

```
✅ server.js
✅ package.json
✅ package-lock.json (optional, but recommended)
✅ models/
   ✅ Admin.js
   ✅ Beat.js
   ✅ Poster.js
✅ routes/
   ✅ auth.js
   ✅ beats.js
   ✅ posters.js
✅ middleware/
   ✅ auth.js (if exists)
✅ .gitignore
```

**Note:** `node_modules/` will be installed automatically during deployment

---

### ❌ **Files NOT to Deploy (Already in .gitignore)**

These are automatically excluded:

```
❌ .env (contains secrets - set as environment variables instead)
❌ node_modules/ (installed during deployment)
❌ uploads/ (empty folder, created automatically)
❌ *.log (log files)
❌ .DS_Store, Thumbs.db (OS files)
❌ .vscode/, .idea/ (IDE files)
❌ scripts/createAdmin.js (only needed locally)
```

---

## 🚀 Deployment Steps

### **Step 1: Deploy Backend First**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Railway/Render:**
   - Connect your GitHub repo
   - Set these **Environment Variables** (NOT in code):
     - `MONGODB_URI` = `mongodb+srv://preston10:Prestonmugz2003@14tugi.zc1f8gw.mongodb.net/14Tugi?retryWrites=true&w=majority`
     - `JWT_SECRET` = `14tugi-secret-key-2024-change-this-in-production`
     - `PORT` = (auto-set by platform, usually 5000)

3. **Get your backend URL:**
   - Railway: `https://your-app.railway.app`
   - Render: `https://your-app.onrender.com`

### **Step 2: Update Frontend API Config**

Before deploying frontend, update `api-config.js`:

```javascript
// Replace localhost with your deployed backend URL
window.API_BASE_URL = 'https://your-backend-url.railway.app/api';
```

### **Step 3: Deploy Frontend**

1. **Push updated frontend to GitHub**
2. **Deploy to Vercel:**
   - Connect GitHub repo
   - Root directory: `/` (root of repo)
   - Build command: (leave empty - static site)
   - Output directory: `/` (root)

---

## 📋 Quick Checklist

### Backend Deployment:
- [ ] All backend files pushed to GitHub
- [ ] Environment variables set in hosting platform
- [ ] Backend URL obtained
- [ ] Backend health check works: `https://your-backend-url/api/health`

### Frontend Deployment:
- [ ] `api-config.js` updated with backend URL
- [ ] All frontend files pushed to GitHub
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Test login on `upload.html`
- [ ] Test beat upload
- [ ] Test poster upload

---

## 🔧 Important Notes

1. **Environment Variables:**
   - NEVER commit `.env` file
   - Set variables in your hosting platform's dashboard
   - Railway/Render have "Environment Variables" section

2. **API Configuration:**
   - Update `api-config.js` with your deployed backend URL
   - This tells the frontend where to find your API

3. **CORS:**
   - Backend already has CORS enabled
   - If you get CORS errors, check your backend URL in `api-config.js`

4. **File Uploads:**
   - Uploaded files go to `uploads/` folder on backend server
   - For production, consider using cloud storage (AWS S3, Cloudinary)

5. **Database:**
   - MongoDB Atlas is already set up
   - Make sure IP whitelist allows all IPs (0.0.0.0/0) or your hosting platform's IPs

---

## 📁 File Structure Summary

```
14 Tugi/
├── Frontend (Deploy to Vercel/Netlify)
│   ├── index.html
│   ├── upload.html
│   ├── ticket-purchase.html
│   ├── ticket-viewer.html
│   ├── styles.css
│   ├── script.js
│   ├── piano.js
│   ├── piano-features.js
│   ├── api.js
│   ├── api-config.js
│   └── images/
│
└── Backend (Deploy to Railway/Render)
    ├── server.js
    ├── package.json
    ├── models/
    ├── routes/
    └── middleware/
```

---

## 🆘 Troubleshooting

**Frontend can't connect to backend:**
- Check `api-config.js` has correct backend URL
- Check backend is running (test `/api/health`)
- Check CORS is enabled on backend

**Uploads not working:**
- Check backend has write permissions
- Check `uploads/` folder exists on backend
- Check file size limits

**Authentication fails:**
- Verify JWT_SECRET matches in backend environment variables
- Clear browser localStorage/sessionStorage
- Try logging in again

