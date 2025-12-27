const mongoose = require('mongoose');

const beatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['hiphop', 'afrobeats', 'r&b', 'trap', 'other']
  },
  bpm: {
    type: String,
    default: 'N/A'
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    default: ''
  },
  audioFile: {
    type: String, // URL or path to audio file
    default: ''
  },
  coverArt: {
    type: String, // URL or path to cover image
    default: ''
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

beatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Beat', beatSchema);

