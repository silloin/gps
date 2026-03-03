const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generatePlan, getCurrentPlan, completeWorkout } = require('../controllers/trainingPlanController');

// @route   POST api/training-plans/generate
// @desc    Generate a training plan for the user
// @access  Private
router.post('/generate', auth, generatePlan);

// @route   GET api/training-plans/current
// @desc    Get current user's training plan
// @access  Private
router.get('/current', auth, getCurrentPlan);

// @route   PUT api/training-plans/workout/:workoutId
// @desc    Mark a workout as completed
// @access  Private
router.put('/workout/:workoutId', auth, completeWorkout);

module.exports = router;
