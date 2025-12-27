const express = require('express');
const router = express.Router();
const Poster = require('../models/Poster');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for poster image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/posters');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'poster-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
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

// Get all posters
router.get('/', async (req, res) => {
  try {
    const posters = await Poster.find().sort({ date: 1 }); // Sort by date ascending
    res.json(posters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single poster
router.get('/:id', async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id);
    if (!poster) {
      return res.status(404).json({ error: 'Poster not found' });
    }
    res.json(poster);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new poster
router.post('/', upload.single('posterImage'), async (req, res) => {
  try {
    const { title, date, time, venue, ticketPrice } = req.body;
    
    let posterImage = '';
    
    // Handle file upload or base64
    if (req.file) {
      posterImage = `/uploads/posters/${req.file.filename}`;
    } else if (req.body.posterImage) {
      // If base64 image is provided
      posterImage = req.body.posterImage;
    } else {
      return res.status(400).json({ error: 'Poster image is required' });
    }

    const poster = new Poster({
      title,
      date: new Date(date),
      time: time || '',
      venue: venue || '',
      ticketPrice: parseFloat(ticketPrice) || 0,
      posterImage
    });

    await poster.save();
    res.status(201).json({ message: 'Poster created successfully', poster });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update poster
router.put('/:id', upload.single('posterImage'), async (req, res) => {
  try {
    const { title, date, time, venue, ticketPrice } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (date) updateData.date = new Date(date);
    if (time !== undefined) updateData.time = time;
    if (venue !== undefined) updateData.venue = venue;
    if (ticketPrice !== undefined) updateData.ticketPrice = parseFloat(ticketPrice);
    
    // Handle new image upload
    if (req.file) {
      // Delete old image if exists
      const poster = await Poster.findById(req.params.id);
      if (poster && poster.posterImage && !poster.posterImage.startsWith('data:')) {
        const oldImagePath = path.join(__dirname, '..', poster.posterImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.posterImage = `/uploads/posters/${req.file.filename}`;
    } else if (req.body.posterImage) {
      updateData.posterImage = req.body.posterImage;
    }

    const poster = await Poster.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!poster) {
      return res.status(404).json({ error: 'Poster not found' });
    }

    res.json({ message: 'Poster updated successfully', poster });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete poster
router.delete('/:id', async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id);
    
    if (!poster) {
      return res.status(404).json({ error: 'Poster not found' });
    }

    // Delete associated image file (if not base64)
    if (poster.posterImage && !poster.posterImage.startsWith('data:')) {
      const imagePath = path.join(__dirname, '..', poster.posterImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Poster.findByIdAndDelete(req.params.id);
    res.json({ message: 'Poster deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

