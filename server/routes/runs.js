const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createRun, getUserRuns } = require('../controllers/runController');

// @route   POST api/runs
// @desc    Record a new run
// @access  Private
router.post('/', auth, createRun);

// @route   GET api/runs
// @desc    Get current user's runs
// @access  Private
router.get('/', auth, getUserRuns);

module.exports = router;
