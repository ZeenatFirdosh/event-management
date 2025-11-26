const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  }],
  timezone: {
    type: String,
    required: true
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  createdBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
eventSchema.index({ profiles: 1, startDateTime: 1 });
eventSchema.index({ profiles: 1, endDateTime: 1 });

module.exports = mongoose.model('Event', eventSchema);