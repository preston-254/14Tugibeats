# Deployment Guide for 14 Tugi Backend

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB

**Option A: MongoDB Atlas (Recommended - Free Cloud Database)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Add it to `.env` file

**Option B: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Use: `mongodb://localhost:27017/tugi-music`

### 3. Create Environment File

Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tugi-music?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key-here-change-this
```

### 4. Create Admin User

```bash
node scripts/createAdmin.js
```

### 5. Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## Deployment Options

### Option 1: Railway (Easiest)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   - `MONGODB_URI` (from MongoDB Atlas)
   - `JWT_SECRET` (random string)
   - `PORT` (Railway sets this automatically)
6. Deploy!

**Update Frontend:**
- Get your Railway URL (e.g., `https://your-app.railway.app`)
- Update `api-config.js`:
  ```javascript
  window.API_BASE_URL = 'https://your-app.railway.app/api';
  ```

### Option 2: Render

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
6. Add environment variables (same as Railway)
7. Deploy!

### Option 3: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create tugi-backend`
4. Add MongoDB Atlas addon: `heroku addons:create mongolab`
5. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   ```
6. Deploy: `git push heroku main`

### Option 4: Vercel (Serverless)

Vercel requires converting to serverless functions. Consider Railway or Render for easier setup.

## Frontend Configuration

After deploying your backend:

1. Update `api-config.js`:
   ```javascript
   // Replace with your deployed backend URL
   window.API_BASE_URL = 'https://your-backend-url.com/api';
   ```

2. Make sure `api.js` and `api-config.js` are loaded before other scripts in `index.html` and `upload.html`

3. Deploy frontend to Vercel (or any static hosting)

## Testing the API

Once deployed, test your API:

```bash
# Health check
curl https://your-backend-url.com/api/health

# Get all beats
curl https://your-backend-url.com/api/beats

# Get all posters
curl https://your-backend-url.com/api/posters
```

## Troubleshooting

### CORS Issues
- Backend already has CORS enabled
- If issues persist, check your backend URL in `api-config.js`

### Images Not Loading
- Check if image paths are correct
- For relative paths, ensure API_BASE_URL is set correctly
- Check browser console for 404 errors

### Authentication Fails
- Verify JWT_SECRET matches between deployments
- Check token expiration (default: 7 days)
- Clear browser storage and login again

### Database Connection Issues
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for all IPs)
- Verify database user has correct permissions

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use strong admin password
- [ ] Enable HTTPS in production
- [ ] Restrict MongoDB Atlas IP whitelist (or use 0.0.0.0/0 for flexibility)
- [ ] Don't commit `.env` file to Git
- [ ] Use environment variables for all secrets

## Support

If you encounter issues:
1. Check server logs
2. Check browser console for errors
3. Verify API_BASE_URL is correct
4. Test API endpoints directly with curl or Postman

