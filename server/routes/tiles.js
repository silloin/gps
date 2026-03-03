const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { captureTiles, getAllTiles } = require('../controllers/tileController');

// @route   POST api/tiles/capture
// @desc    Capture tiles based on route
// @access  Private
router.post('/capture', auth, captureTiles);

// @route   GET api/tiles
// @desc    Get all tiles for the map
// @access  Public
router.get('/', getAllTiles);

module.exports = router;
