const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, default: 'Untitled Note' },
  content: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
