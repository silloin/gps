const TrainingPlan = require('../models/TrainingPlan');
const User = require('../models/User');

// @route   POST api/training-plans/generate
// @desc    Generate a training plan for the user
// @access  Private
exports.generatePlan = async (req, res) => {
  const { planType } = req.body; // 'beginner', '5k', '10k'
  const userId = req.user.id;

  try {
    let workouts = [];
    if (planType === 'beginner') {
      workouts = [
        { day: 1, workoutType: 'Run 10 mins', duration: 10 },
        { day: 2, workoutType: 'Rest', duration: 0 },
        { day: 3, workoutType: 'Run 12 mins', duration: 12 },
        { day: 4, workoutType: 'Rest', duration: 0 },
        { day: 5, workoutType: 'Run 15 mins', duration: 15 },
        { day: 6, workoutType: 'Walk 30 mins', duration: 30 },
        { day: 7, workoutType: 'Rest', duration: 0 },
      ];
    } else if (planType === '5k') {
      workouts = [
        { day: 1, workoutType: 'Run 2km', distance: 2 },
        { day: 2, workoutType: 'Rest', duration: 0 },
        { day: 3, workoutType: 'Run 2.5km', distance: 2.5 },
        { day: 4, workoutType: 'Rest', duration: 0 },
        { day: 5, workoutType: 'Run 3km', distance: 3 },
        { day: 6, workoutType: 'Walk 5km', distance: 5 },
        { day: 7, workoutType: 'Rest', duration: 0 },
      ];
    }

    const newPlan = new TrainingPlan({
      user: userId,
      planType,
      workouts,
    });

    const plan = await newPlan.save();
    
    // Update user's training plan reference
    await User.findByIdAndUpdate(userId, { trainingPlan: plan.id });

    res.json(plan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/training-plans/current
// @desc    Get current user's training plan
// @access  Private
exports.getCurrentPlan = async (req, res) => {
  try {
    const plan = await TrainingPlan.findOne({ user: req.user.id }).sort({ startDate: -1 });
    res.json(plan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/training-plans/workout/:workoutId
// @desc    Mark a workout as completed
// @access  Private
exports.completeWorkout = async (req, res) => {
  try {
    const plan = await TrainingPlan.findOne({ user: req.user.id });
    if (!plan) return res.status(404).json({ msg: 'Plan not found' });

    const workout = plan.workouts.id(req.params.workoutId);
    if (!workout) return res.status(404).json({ msg: 'Workout not found' });

    workout.completed = true;
    await plan.save();

    res.json(plan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
