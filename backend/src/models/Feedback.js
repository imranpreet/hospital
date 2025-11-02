const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  patientName: String,
  rating: Number,
  message: String
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
