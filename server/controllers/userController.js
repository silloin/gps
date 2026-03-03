const User = require('../models/User');

// @route   GET api/users/leaderboard
// @desc    Get global or city leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  const { city } = req.query;
  const filter = city ? { city: new RegExp(city, 'i') } : {};

  try {
    const users = await User.find(filter)
      .select('username totalTiles totalDistance city')
      .sort({ totalTiles: -1 })
      .limit(20);
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/users/prize-draw
// @desc    Random monthly prize draw from top users
// @access  Private/Admin
exports.monthlyPrizeDraw = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ totalTiles: -1 })
      .limit(10); // Draw from top 10 tile holders

    if (topUsers.length === 0) return res.status(404).json({ msg: 'No eligible users found' });

    const winner = topUsers[Math.floor(Math.random() * topUsers.length)];

    res.json({
      winner: winner.username,
      prize: 'RunTerra Pro Achievement Badge + $25 Gear Voucher',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
