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
  bio: { type: String },
  education: { type: String }, // e.g., "MD, DM Cardiology - Harvard Medical School"
  educationDetails: {
    degree: { type: String }, // e.g., "MD (Doctor of Medicine)"
    university: { type: String }, // e.g., "Harvard Medical School"
    year: { type: String }, // e.g., "2010"
    additional: { type: String }, // e.g., "Fellowship in Interventional Cardiology"
    certifications: [{ type: String }] // e.g., ["Board Certified Cardiologist", "ACLS Certified"]
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
