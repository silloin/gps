const Run = require('../models/Run');
const User = require('../models/User');

// @route   POST api/runs
// @desc    Record a new run
// @access  Private
exports.createRun = async (req, res) => {
  const { distance, duration, avgPace, route, tiles } = req.body;
  const userId = req.user.id;

  try {
    const newRun = new Run({
      user: userId,
      distance,
      duration,
      avgPace,
      route,
      tiles,
    });

    const run = await newRun.save();

    // Update user stats
    const user = await User.findById(userId);
    user.totalDistance += distance;
    user.runs.push(run.id);
    await user.save();

    res.json(run);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/runs
// @desc    Get current user's runs
// @access  Private
exports.getUserRuns = async (req, res) => {
  try {
    const runs = await Run.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(runs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
