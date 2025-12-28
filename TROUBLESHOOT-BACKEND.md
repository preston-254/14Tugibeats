# Troubleshooting Backend Connection Issues

## Common Issues & Solutions

### Issue 1: "Cannot connect" or Timeout Error

**Cause:** Render free tier spins down after 15 minutes of inactivity.

**Solution:**
1. **Wait 30-60 seconds** - The first request after spin-down takes time to wake up the server
2. **Try again** - The server should respond after it wakes up
3. **Check Render logs** - Go to your Render dashboard → Service → Logs to see if the server is starting

---

### Issue 2: "Cannot GET /" Error

**Cause:** Server might not be running or route not found.

**Solution:**
1. Check Render dashboard - Is the service "Live"?
2. Check logs for errors
3. Try these URLs:
   - `https://one4tugibeats-backend.onrender.com/` (root)
   - `https://one4tugibeats-backend.onrender.com/api/health` (health check)
   - `https://one4tugibeats-backend.onrender.com/api/beats` (beats endpoint)

---

### Issue 3: CORS Error (in browser console)

**Cause:** CORS not properly configured (but we have it enabled).

**Solution:**
- Already fixed in `server.js` with `app.use(cors())`
- If still seeing CORS errors, check browser console for specific error

---

### Issue 4: 404 Not Found

**Cause:** Wrong URL or route doesn't exist.

**Solution:**
- Make sure you're using: `https://one4tugibeats-backend.onrender.com/api/...`
- Check that the route exists in the routes files

---

## Quick Test Steps

1. **Test Root URL:**
   ```
   https://one4tugibeats-backend.onrender.com/
   ```
   Should return JSON with API info

2. **Test Health Check:**
   ```
   https://one4tugibeats-backend.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"14 Tugi API is running"}`

3. **Test Beats Endpoint:**
   ```
   https://one4tugibeats-backend.onrender.com/api/beats
   ```
   Should return array of beats (empty if no beats uploaded yet)

---

## Check Render Dashboard

1. Go to https://render.com
2. Log in
3. Click on your service: `14Tugibeats-backend`
4. Check:
   - **Status:** Should be "Live" (green)
   - **Logs:** Look for "✅ Connected to MongoDB" and "🚀 Server running"
   - **Events:** Check for any deployment errors

---

## If Server Won't Start

1. **Check Environment Variables:**
   - Go to Render Dashboard → Your Service → Environment
   - Verify:
     - `MONGODB_URI` is set
     - `JWT_SECRET` is set
     - `PORT` is auto-set (don't need to set manually)

2. **Check Logs for Errors:**
   - Look for red error messages
   - Common errors:
     - MongoDB connection failed
     - Missing environment variables
     - Port binding issues

---

## Keep Server Awake (Optional)

To prevent spin-down, you can set up a ping service (like UptimeRobot) to ping your server every 10 minutes.

**Free Services:**
- UptimeRobot (free tier: 50 monitors)
- Pingdom
- StatusCake

**Setup:**
1. Create account
2. Add monitor
3. URL: `https://one4tugibeats-backend.onrender.com/api/health`
4. Interval: 10 minutes

---

## Still Not Working?

1. **Restart the service:**
   - Render Dashboard → Service → Manual Deploy → Clear build cache & deploy

2. **Check MongoDB Atlas:**
   - Make sure Network Access allows all IPs (0.0.0.0/0)
   - Verify connection string is correct

3. **Test locally:**
   ```bash
   node server.js
   ```
   Then visit: `http://localhost:5000/api/health`

