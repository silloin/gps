const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getLeaderboard, monthlyPrizeDraw } = require('../controllers/userController');

// @route   GET api/users/leaderboard
// @desc    Get global/city leaderboard
// @access  Public
router.get('/leaderboard', getLeaderboard);

// @route   POST api/users/prize-draw
// @desc    Monthly prize draw (Admin/Private)
// @access  Private
router.post('/prize-draw', auth, monthlyPrizeDraw);

module.exports = router;
