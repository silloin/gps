const Tile = require('../models/Tile');
const User = require('../models/User');
const Zone = require('../models/Zone');
const ngeohash = require('ngeohash');

// Precision 7 is roughly 150m x 150m
const GEOHASH_PRECISION = 7;

// @route   POST api/tiles/capture
// @desc    Capture tiles based on route
// @access  Private
exports.captureTiles = async (req, res) => {
  const { route } = req.body; // Array of { lat, lng }
  const userId = req.user.id;

  try {
    const capturedTiles = [];
    const uniqueGeohashes = new Map();

    route.forEach((point) => {
      const hash = ngeohash.encode(point.lat, point.lng, GEOHASH_PRECISION);
      uniqueGeohashes.set(hash, { lat: point.lat, lng: point.lng });
    });

    for (const [hash, coords] of uniqueGeohashes) {
      let tile = await Tile.findOne({ geoHash: hash });

      if (!tile) {
        tile = new Tile({
          owner: userId,
          geoHash: hash,
          location: {
            type: 'Point',
            coordinates: [coords.lng, coords.lat],
          },
          value: 1, // Default value for a tile
        });
      } else {
        // If someone else owns it, add to history before changing owner
        if (tile.owner.toString() !== userId) {
          tile.history.push({
            owner: tile.owner,
            timestamp: tile.capturedAt,
          });
          tile.owner = userId;
          tile.capturedAt = Date.now();
        }
      }

      await tile.save();
      capturedTiles.push(tile);

      // Trigger Zone ranking update if tile belongs to a zone
      if (tile.zone) {
        updateZoneStats(tile.zone);
      }
    }

    // Update user's total territory and exploration bonus
    const user = await User.findById(userId);
    const oldTileCount = user.totalTiles;
    user.totalTiles = await Tile.countDocuments({ owner: userId });
    
    // Exploration Bonus: Reward if user discovered more than 10 new tiles in one run
    if (user.totalTiles - oldTileCount > 10) {
      user.totalDistance += 0.5; // Bonus 0.5km for exploring
    }
    
    await user.save();

    // Broadcast the update to all connected clients
    req.io.emit('tiles-captured', {
      userId,
      username: user.username,
      tiles: capturedTiles,
    });

    res.json(capturedTiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Helper to update zone rankings (King/Queen)
async function updateZoneStats(zoneId) {
  try {
    const rankings = await Tile.aggregate([
      { $match: { zone: zoneId } },
      { $group: { _id: '$owner', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const zone = await Zone.findById(zoneId);
    if (zone && rankings.length > 0) {
      zone.king = rankings[0]._id;
      if (rankings.length > 1) {
        zone.queen = rankings[1]._id;
      }
      zone.totalTiles = await Tile.countDocuments({ zone: zoneId });
      await zone.save();
    }
  } catch (err) {
    console.error('Error updating zone stats:', err);
  }
}

// @route   GET api/tiles
// @desc    Get all tiles for the map
// @access  Public
exports.getAllTiles = async (req, res) => {
  try {
    const tiles = await Tile.find().populate('owner', 'username');
    res.json(tiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
