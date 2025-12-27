const mongoose = require('mongoose');

const posterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    default: ''
  },
  venue: {
    type: String,
    default: ''
  },
  ticketPrice: {
    type: Number,
    required: true,
    default: 0
  },
  posterImage: {
    type: String, // URL or base64 or file path
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Poster', posterSchema);

