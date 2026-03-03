const Zone = require('../models/Zone');
const Tile = require('../models/Tile');
const User = require('../models/User');

// @route   GET api/zones
// @desc    Get all zones with their kings/queens
// @access  Public
exports.getZones = async (req, res) => {
  try {
    const zones = await Zone.find().populate('king', 'username').populate('queen', 'username');
    res.json(zones);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/zones/update-rankings/:zoneId
// @desc    Calculate and update the king/queen for a zone
// @access  Internal/Private
exports.updateZoneRankings = async (req, res) => {
  const { zoneId } = req.params;

  try {
    const zone = await Zone.findById(zoneId);
    if (!zone) return res.status(404).json({ msg: 'Zone not found' });

    // Find all tiles in this zone and count by owner
    const rankings = await Tile.aggregate([
      { $match: { zone: zone._id } },
      { $group: { _id: '$owner', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    if (rankings.length > 0) {
      zone.king = rankings[0]._id;
      if (rankings.length > 1) {
        zone.queen = rankings[1]._id;
      }
      zone.totalTiles = await Tile.countDocuments({ zone: zone._id });
      await zone.save();
    }

    res.json(zone);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/zones
// @desc    Create a new zone (Admin only)
// @access  Private/Admin
exports.createZone = async (req, res) => {
  const { name, city } = req.body;
  try {
    const newZone = new Zone({ name, city });
    const zone = await newZone.save();
    res.json(zone);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
