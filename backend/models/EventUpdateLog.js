const mongoose = require('mongoose');

const eventUpdateLogSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  updatedBy: {
    type: String,
    default: 'admin'
  },
  changes: {
    field: {
      type: String,
      required: true
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Index for efficient log retrieval
eventUpdateLogSchema.index({ eventId: 1, timestamp: -1 });

module.exports = mongoose.model('EventUpdateLog', eventUpdateLogSchema);