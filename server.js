const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tugi-music';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Import routes
const beatsRoutes = require('./routes/beats');
const postersRoutes = require('./routes/posters');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/beats', beatsRoutes);
app.use('/api/posters', postersRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '14 Tugi API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: '14 Tugi API Server',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      beats: '/api/beats',
      posters: '/api/posters',
      auth: '/api/auth'
    }
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Bind to 0.0.0.0 for Render (required for external access)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://0.0.0.0:${PORT}/api`);
});

