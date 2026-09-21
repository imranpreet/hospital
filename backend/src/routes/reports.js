const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');
const Report = require('../models/Report');
const { auth } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '../../uploads');
const localReportMetaPath = path.join(uploadDir, 'report-meta.json');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function readLocalReportMeta() {
  try {
    if (!fs.existsSync(localReportMetaPath)) return [];
    const data = fs.readFileSync(localReportMetaPath, 'utf8');
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeLocalReportMeta(records) {
  fs.writeFileSync(localReportMetaPath, JSON.stringify(records, null, 2));
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, '-');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${safeName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/csv'
  ];

  if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(jpg|jpeg|png|webp|pdf|txt|doc|docx|xls|xlsx|csv)$/i)) {
    cb(null, true);
    return;
  }

  cb(new Error('Unsupported file type. Please upload an image, PDF, document, or text file.'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const buildLocalFileUrl = (req, filename) => {
  const baseUrl = process.env.BACKEND_URL || 'https://hospitalmanagement-backend-0g6l.onrender.com';
  return `${baseUrl}/uploads/${filename}`;
};

function buildLocalReportPayload(req, file, fileURL) {
  return {
    _id: `local-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    patientId: req.body.patientId || req.user.id,
    userId: req.user.id,
    uploadedBy: req.user.id,
    doctorId: req.body.doctorId || '',
    type: req.body.type || 'Medical Report',
    fileName: file.filename,
    originalName: file.originalname || 'medical-report',
    mimeType: file.mimetype || 'application/octet-stream',
    description: req.body.description || '',
    fileURL,
    status: 'uploaded',
    uploadedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    savedLocally: true
  };
}

router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please select a file to upload.' });
    }

    const patientId = req.body.patientId || req.user.id;
    const userId = req.user.id;
    const fileType = req.body.type || 'Medical Report';
    const description = req.body.description || '';
    const originalName = req.file.originalname || 'medical-report';

    let fileURL = buildLocalFileUrl(req, req.file.filename);
    const hasCloudinaryDirectConfig = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (process.env.CLOUDINARY_URL || hasCloudinaryDirectConfig) {
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
      fileURL = cloudinaryResult.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const report = new Report({
      patientId,
      userId,
      uploadedBy: req.user.id,
      doctorId: req.body.doctorId || '',
      type: fileType,
      fileName: req.file.filename,
      originalName,
      mimeType: req.file.mimetype || 'application/octet-stream',
      description,
      fileURL,
      status: 'uploaded'
    });

    try {
      await report.save();
      return res.status(201).json(report);
    } catch (dbErr) {
      const localReport = buildLocalReportPayload(req, req.file, fileURL);
      const localReports = readLocalReportMeta();
      localReports.unshift(localReport);
      writeLocalReportMeta(localReports);
      return res.status(201).json(localReport);
    }
  } catch (err) {
    console.error('Report upload error:', err);
    res.status(500).json({ msg: err.message || 'Failed to upload file.' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let reportList = [];
    try {
      if (role === 'admin') {
        reportList = await Report.find({}).sort({ createdAt: -1 });
      } else if (role === 'doctor') {
        reportList = await Report.find({
          $or: [
            { doctorId: userId.toString() },
            { doctorId: userId },
            { uploadedBy: userId },
            { patientId: userId },
            { userId: userId }
          ]
        }).sort({ createdAt: -1 });
      } else {
        reportList = await Report.find({
          $or: [
            { patientId: userId },
            { userId: userId },
            { uploadedBy: userId }
          ]
        }).sort({ createdAt: -1 });
      }
    } catch (dbErr) {
      reportList = readLocalReportMeta();
      if (role === 'patient') {
        reportList = reportList.filter((item) => item.patientId === userId || item.userId === userId || item.uploadedBy === userId);
      } else if (role === 'doctor') {
        reportList = reportList.filter((item) => item.doctorId === userId.toString() || item.doctorId === userId || item.uploadedBy === userId || item.patientId === userId || item.userId === userId);
      }
    }

    return res.json(reportList);
  } catch (err) {
    console.error('Fetch reports error:', err);
    res.status(500).json({ msg: 'Failed to load reports.' });
  }
});

router.get('/doctor', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const reports = await Report.find({
      $or: [
        { doctorId: userId.toString() },
        { doctorId: userId },
        { uploadedBy: userId },
        { patientId: userId },
        { userId: userId }
      ]
    }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error('Fetch doctor reports error:', err);
    res.status(500).json({ msg: 'Failed to load doctor reports.' });
  }
});

router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const role = req.user.role;
    const userId = req.user.id;

    if (role !== 'admin' && role !== 'doctor' && role !== 'patient') {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    if (role === 'patient' && patientId !== userId.toString()) {
      return res.status(403).json({ msg: 'You can only view your own records.' });
    }

    const reports = await Report.find({
      $or: [
        { patientId },
        { userId: patientId },
        { uploadedBy: patientId }
      ]
    }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error('Fetch patient reports error:', err);
    res.status(500).json({ msg: 'Failed to load patient reports.' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (report) {
      return res.json(report);
    }

    const localReports = readLocalReportMeta();
    const localReport = localReports.find((item) => item._id === req.params.id);
    if (!localReport) {
      return res.status(404).json({ msg: 'Report not found.' });
    }

    return res.json(localReport);
  } catch (err) {
    const localReports = readLocalReportMeta();
    const localReport = localReports.find((item) => item._id === req.params.id);
    if (!localReport) {
      console.error('Get report by id error:', err);
      return res.status(500).json({ msg: 'Failed to fetch report.' });
    }
    return res.json(localReport);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (report) {
      if (report.userId !== req.user.id && report.uploadedBy !== req.user.id) {
        return res.status(403).json({ msg: 'You are not allowed to delete this report.' });
      }

      await Report.findByIdAndDelete(req.params.id);
      return res.json({ msg: 'Report deleted successfully.' });
    }

    const localReports = readLocalReportMeta();
    const filtered = localReports.filter((item) => item._id !== req.params.id);
    writeLocalReportMeta(filtered);
    return res.json({ msg: 'Report deleted successfully.' });
  } catch (err) {
    const localReports = readLocalReportMeta();
    const filtered = localReports.filter((item) => item._id !== req.params.id);
    writeLocalReportMeta(filtered);
    return res.json({ msg: 'Report deleted successfully.' });
  }
});

module.exports = router;
