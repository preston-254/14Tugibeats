# Deploy Backend to Render (FREE) - Step by Step Guide

## 🎨 Render Backend Deployment (Free Tier)

### **Step 1: Create Render Account**

1. Go to https://render.com
2. Click **"Get Started for Free"** or **"Sign Up"**
3. Sign up with **GitHub** (recommended - easier to connect repos)
4. Authorize Render to access your GitHub

---

### **Step 2: Deploy from GitHub**

1. **In Render Dashboard:**
   - Click **"New +"** button (top right)
   - Select **"Web Service"**

2. **Connect Repository:**
   - Click **"Connect account"** if not connected
   - Select your repository: `preston-254/14Tugibeats`
   - Click **"Connect"**

3. **Configure Service:**
   - **Name:** `14tugi-backend` (or any name you like)
   - **Region:** Choose closest to you (e.g., `Oregon (US West)`)
   - **Branch:** `main`
   - **Root Directory:** Leave empty (or set to root if needed)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Select **"Free"** (512 MB RAM)

4. **Environment Variables:**
   Click **"Advanced"** → **"Add Environment Variable"** and add:
   
   ```
   MONGODB_URI = mongodb+srv://preston10:Prestonmugz2003@14tugi.zc1f8gw.mongodb.net/14Tugi?retryWrites=true&w=majority
   JWT_SECRET = 14tugi-secret-key-2024-change-this-in-production
   PORT = (leave empty - Render sets this automatically)
   ```

5. **Click "Create Web Service"**

---

### **Step 3: Wait for Deployment**

- Render will:
  1. Clone your repository
  2. Run `npm install`
  3. Start your server with `node server.js`
  4. Give you a URL like: `https://14tugi-backend.onrender.com`

**Note:** Free tier services spin down after 15 minutes of inactivity. First request after spin-down may take 30-60 seconds.

---

### **Step 4: Update Frontend API Config**

Once deployed, update `api-config.js`:

```javascript
// For production (Render)
window.API_BASE_URL = 'https://your-app-name.onrender.com/api';

// For local development
// window.API_BASE_URL = 'http://localhost:5000/api';
```

Replace `your-app-name` with your actual Render service name.

---

### **Step 5: Test Your Backend**

1. Visit: `https://your-app-name.onrender.com/api/beats`
2. You should see: `[]` (empty array) or your beats if any exist
3. If you see JSON, your backend is working! ✅

---

## 🆓 Free Tier Limitations

- **Spins down after 15 minutes** of inactivity
- **First request** after spin-down takes 30-60 seconds
- **512 MB RAM** (enough for your app)
- **750 hours/month** free (more than enough)

---

## 🔄 Alternative: Keep Service Awake

To prevent spin-down, you can:
1. Use a service like **UptimeRobot** (free) to ping your URL every 5 minutes
2. Or upgrade to paid plan ($7/month)

---

## ✅ Deployment Checklist

- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Web service created
- [ ] Environment variables set
- [ ] Service deployed successfully
- [ ] Backend URL obtained
- [ ] `api-config.js` updated with backend URL
- [ ] Tested API endpoint

---

## 🆘 Troubleshooting

### **Service won't start:**
- Check **Logs** tab in Render dashboard
- Verify environment variables are set correctly
- Ensure `package.json` has correct `start` script

### **Can't connect to MongoDB:**
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` to allow all IPs)
- Verify `MONGODB_URI` is correct in environment variables

### **504 Gateway Timeout:**
- Normal on free tier after spin-down
- Wait 30-60 seconds for first request
- Consider using UptimeRobot to keep service awake

---

## 📝 Next Steps

1. **Deploy frontend** to Vercel/Netlify (already done)
2. **Update `api-config.js`** with Render backend URL
3. **Test the full application**
4. **Set up UptimeRobot** (optional) to keep backend awake

---

**Your backend will be live at:** `https://your-app-name.onrender.com`

