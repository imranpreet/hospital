const mongoose = require('mongoose');

const projectFileSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalName: { type: String, required: true },
  fileName: { type: String, required: true },
  mimeType: { type: String, default: 'application/octet-stream' },
  size: { type: Number, default: 0 },
  fileURL: { type: String, required: true },
  previewMode: { type: String, default: 'download' }
}, { timestamps: true });

module.exports = mongoose.model('ProjectFile', projectFileSchema);
