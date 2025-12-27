# 14 Tugi Backend API

Backend API for the 14 Tugi music producer website.

## Features

- ✅ RESTful API for beats management
- ✅ RESTful API for listening party posters
- ✅ Admin authentication with JWT
- ✅ File upload handling (audio files and images)
- ✅ MongoDB database integration
- ✅ CORS enabled for frontend integration

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB on your computer
- Start MongoDB service
- Update `.env` with: `MONGODB_URI=mongodb://localhost:27017/tugi-music`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Update `.env` with your Atlas connection string

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Update the values:
   ```env
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-random-secret-key
   ```

### 4. Create Admin User

Run this once to create the admin user:

```bash
node scripts/createAdmin.js
```

Or use this code in Node.js:
```javascript
const Admin = require('./models/Admin');
const admin = new Admin({
  username: 'tugi',
  password: '14tugi2024'
});
admin.save().then(() => console.log('Admin created!'));
```

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
  ```json
  {
    "username": "tugi",
    "password": "14tugi2024"
  }
  ```

- `GET /api/auth/verify` - Verify token (requires Authorization header)

### Beats

- `GET /api/beats` - Get all beats
- `GET /api/beats/:id` - Get single beat
- `POST /api/beats` - Create new beat (multipart/form-data)
- `PUT /api/beats/:id` - Update beat
- `DELETE /api/beats/:id` - Delete beat

### Posters

- `GET /api/posters` - Get all posters
- `GET /api/posters/:id` - Get single poster
- `POST /api/posters` - Create new poster (multipart/form-data or JSON with base64)
- `PUT /api/posters/:id` - Update poster
- `DELETE /api/posters/:id` - Delete poster

## Deployment Options

### Option 1: Vercel (Serverless Functions)
- Convert routes to Vercel serverless functions
- Use MongoDB Atlas for database

### Option 2: Railway
1. Push code to GitHub
2. Connect to Railway
3. Add MongoDB Atlas connection
4. Deploy

### Option 3: Render
1. Create new Web Service
2. Connect GitHub repo
3. Add MongoDB Atlas
4. Deploy

### Option 4: Heroku
1. Create Heroku app
2. Add MongoDB Atlas addon
3. Deploy

## Frontend Integration

Update your frontend code to use the API instead of localStorage:

```javascript
// Example: Fetch beats
fetch('https://your-api-url.com/api/beats')
  .then(res => res.json())
  .then(beats => {
    // Use beats data
  });

// Example: Create beat with authentication
fetch('https://your-api-url.com/api/beats', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    // Don't set Content-Type for FormData
  },
  body: formData
});
```

## File Structure

```
backend/
├── server.js          # Main server file
├── models/           # MongoDB models
│   ├── Beat.js
│   ├── Poster.js
│   └── Admin.js
├── routes/          # API routes
│   ├── beats.js
│   ├── posters.js
│   └── auth.js
├── uploads/         # Uploaded files (created automatically)
│   ├── beats/
│   ├── covers/
│   └── posters/
├── .env            # Environment variables (create this)
└── package.json
```

## Security Notes

- Change JWT_SECRET in production
- Use strong passwords
- Enable HTTPS in production
- Consider adding rate limiting
- Validate all inputs
- Sanitize file uploads

