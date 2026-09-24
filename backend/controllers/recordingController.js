const path = require('path');
const fs = require('fs');
const asyncHandler = require('../utils/asyncHandler');
const Recording = require('../models/Recording');

// @route POST /api/recordings
// @desc  Upload and save audio recording
const createRecording = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded' });
  }

  const { duration, recordedAt } = req.body;

  const recording = await Recording.create({
    user: req.user._id,
    file_name: req.file.originalname || req.file.filename,
    file_path: req.file.path.replace(/\\/g, '/'),
    mime_type: req.file.mimetype || 'audio/webm',
    duration: duration ? Number(duration) : 0,
    created_at: recordedAt ? new Date(recordedAt) : new Date(),
  });

  res.status(201).json(recording);
});

// @route GET /api/recordings
// @desc  Get all recordings for the logged-in user (newest first)
const getRecordings = asyncHandler(async (req, res) => {
  const recordings = await Recording.find({ user: req.user._id })
    .sort({ created_at: -1, createdAt: -1 });

  res.status(200).json({ recordings });
});

// @route GET /api/recordings/:id
// @desc  Stream/serve the audio file
const getRecordingById = asyncHandler(async (req, res) => {
  const recording = await Recording.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!recording) {
    return res.status(404).json({ message: 'Recording not found' });
  }

  const filePath = path.resolve(recording.file_path);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Audio file not found on disk' });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  // Support range requests for HTML5 audio seek bar
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send(`Requested range not satisfiable\n${start} >= ${fileSize}`);
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': recording.mime_type || 'audio/webm',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': recording.mime_type || 'audio/webm',
      'Accept-Ranges': 'bytes',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

// @route DELETE /api/recordings/:id
// @desc  Delete recording DB record AND physical audio file
const deleteRecording = asyncHandler(async (req, res) => {
  const recording = await Recording.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!recording) {
    return res.status(404).json({ message: 'Recording not found' });
  }

  // Remove physical audio file from disk
  const filePath = path.resolve(recording.file_path);
  if (fs.existsSync(filePath)) {
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.warn(`Could not delete file ${filePath}:`, err.message);
    }
  }

  // Delete document from MongoDB
  await recording.deleteOne();

  res.status(200).json({ message: 'Recording deleted successfully' });
});

module.exports = {
  createRecording,
  getRecordings,
  getRecordingById,
  deleteRecording,
};
