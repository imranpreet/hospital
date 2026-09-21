const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  patientId: { type: String, default: '' },
  userId: { type: String, default: '' },
  uploadedBy: { type: String, default: '' },
  doctorId: { type: String, default: '' },
  type: { type: String, default: 'Medical Report' },
  fileName: { type: String, default: 'medical-report' },
  originalName: { type: String, default: '' },
  mimeType: { type: String, default: 'application/octet-stream' },
  description: { type: String, default: '' },
  fileURL: { type: String, required: true },
  status: { type: String, default: 'uploaded' },
  uploadedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
