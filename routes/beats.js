const express = require('express');
const router = express.Router();
const Beat = require('../models/Beat');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/beats');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'beat-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /audio\/(mp3|wav|flac|m4a)/;
    if (allowedTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

const coverUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../uploads/covers');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /image\/(jpeg|jpg|png|webp)/;
    if (allowedTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// Get all beats
router.get('/', async (req, res) => {
  try {
    const beats = await Beat.find().sort({ uploadedAt: -1 });
    res.json(beats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single beat
router.get('/:id', async (req, res) => {
  try {
    const beat = await Beat.findById(req.params.id);
    if (!beat) {
      return res.status(404).json({ error: 'Beat not found' });
    }
    res.json(beat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new beat
router.post('/', upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'coverArt', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, category, bpm, price, tags, description } = req.body;
    
    const beatData = {
      title,
      category: category || 'other',
      bpm: bpm || 'N/A',
      price: parseFloat(price) || 0,
      description: description || ''
    };

    // Parse tags if provided as string
    if (tags) {
      beatData.tags = typeof tags === 'string' 
        ? tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : tags;
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.audioFile) {
        beatData.audioFile = `/uploads/beats/${req.files.audioFile[0].filename}`;
      }
      if (req.files.coverArt) {
        beatData.coverArt = `/uploads/covers/${req.files.coverArt[0].filename}`;
      }
    }

    const beat = new Beat(beatData);
    await beat.save();
    
    res.status(201).json({ message: 'Beat created successfully', beat });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update beat
router.put('/:id', async (req, res) => {
  try {
    const { title, category, bpm, price, tags, description } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (category) updateData.category = category;
    if (bpm) updateData.bpm = bpm;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (description !== undefined) updateData.description = description;
    if (tags) {
      updateData.tags = typeof tags === 'string' 
        ? tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : tags;
    }
    
    updateData.updatedAt = Date.now();

    const beat = await Beat.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!beat) {
      return res.status(404).json({ error: 'Beat not found' });
    }

    res.json({ message: 'Beat updated successfully', beat });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete beat
router.delete('/:id', async (req, res) => {
  try {
    const beat = await Beat.findById(req.params.id);
    
    if (!beat) {
      return res.status(404).json({ error: 'Beat not found' });
    }

    // Delete associated files
    if (beat.audioFile) {
      const audioPath = path.join(__dirname, '..', beat.audioFile);
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    }
    if (beat.coverArt) {
      const coverPath = path.join(__dirname, '..', beat.coverArt);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }

    await Beat.findByIdAndDelete(req.params.id);
    res.json({ message: 'Beat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

