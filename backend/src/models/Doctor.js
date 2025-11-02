const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: String, // e.g., Monday
  slots: [String], // times like '09:00'
});

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String },
  department: { type: String },
  schedule: [scheduleSchema],
  image: { type: String },
  bio: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
