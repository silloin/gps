const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getZones, updateZoneRankings, createZone } = require('../controllers/zoneController');

// @route   GET api/zones
// @desc    Get all zones
// @access  Public
router.get('/', getZones);

// @route   POST api/zones
// @desc    Create a new zone (Admin only)
// @access  Private
router.post('/', auth, createZone);

// @route   POST api/zones/update-rankings/:zoneId
// @desc    Update king/queen rankings for a zone
// @access  Private
router.post('/update-rankings/:zoneId', auth, updateZoneRankings);

module.exports = router;
