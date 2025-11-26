const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  timezone: {
    type: String,
    default: 'America/New_York'
  }
}, {
  timestamps: true
});

// Index for faster lookups
profileSchema.index({ name: 1 });

module.exports = mongoose.model('Profile', profileSchema);