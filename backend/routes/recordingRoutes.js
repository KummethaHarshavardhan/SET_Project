const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  createRecording,
  getRecordings,
  getRecordingById,
  deleteRecording,
} = require('../controllers/recordingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'recordings');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, `recording-${uniqueSuffix}${ext}`);
  },
});

// File filter: accept only audio
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype &&
    (file.mimetype.startsWith('audio/') ||
      file.mimetype === 'video/webm' || // Some browsers label webm audio as video/webm
      file.mimetype === 'application/octet-stream')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio recordings are allowed.'), false);
  }
};

// 25 MB file limit
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter,
});

// Custom upload error wrapper to return proper HTTP status codes
const handleUpload = (req, res, next) => {
  upload.single('audio')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res
          .status(413)
          .json({ message: 'File is too large. Maximum allowed size is 25 MB.' });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.use(protect);

router.route('/')
  .get(getRecordings)
  .post(handleUpload, createRecording);

router.route('/:id')
  .get(getRecordingById)
  .delete(deleteRecording);

module.exports = router;
