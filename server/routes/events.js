const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createEvent, getEvents, joinEvent } = require('../controllers/eventController');

// @route   POST api/events
// @desc    Create a new event (Admin only)
// @access  Private
router.post('/', auth, createEvent);

// @route   GET api/events
// @desc    Get active events
// @access  Public
router.get('/', getEvents);

// @route   POST api/events/join/:eventId
// @desc    Join an event
// @access  Private
router.post('/join/:eventId', auth, joinEvent);

module.exports = router;
