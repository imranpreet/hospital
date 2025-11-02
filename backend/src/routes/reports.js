const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: '/tmp' });
const cloudinary = require('../utils/cloudinary');
const Report = require('../models/Report');
const { auth } = require('../middleware/auth');
const fs = require('fs');

router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try{
    if (!req.file) return res.status(400).json({ msg: 'No file' });
    if (!process.env.CLOUDINARY_URL) {
      // fallback: return path
      return res.status(500).json({ msg: 'Cloudinary not configured' });
    }
    const r = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
    fs.unlinkSync(req.file.path);
    const report = new Report({ patientId: req.body.patientId, type: req.body.type, fileURL: r.secure_url });
    await report.save();
    res.json(report);
  }catch(err){ console.error(err); res.status(500).json({ msg: 'err' }) }
});

router.get('/:patientId', auth, async (req, res)=>{
  const reports = await Report.find({ patientId: req.params.patientId });
  res.json(reports);
});

module.exports = router;
