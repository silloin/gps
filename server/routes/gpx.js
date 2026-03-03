const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const { uploadGPX } = require('../controllers/gpxController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   POST api/gpx/upload
// @desc    Upload a GPX file
// @access  Private
router.post('/upload', auth, upload.single('gpx'), uploadGPX);

module.exports = router;
