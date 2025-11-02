const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  roomType: {
    type: String,
    enum: ['ICU', 'General', 'Private', 'Emergency', 'Maternity'],
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  occupiedBeds: {
    type: Number,
    default: 0
  },
  availableBeds: {
    type: Number,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  amenities: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['Active', 'Maintenance', 'Closed'],
    default: 'Active'
  }
}, { timestamps: true });

// Update available beds before saving
roomSchema.pre('save', function(next) {
  this.availableBeds = this.capacity - this.occupiedBeds;
  next();
});

module.exports = mongoose.model('Room', roomSchema);
