const GpxParser = require('gpxparser');
const Run = require('../models/Run');
const User = require('../models/User');
const Tile = require('../models/Tile');
const ngeohash = require('ngeohash');

const GEOHASH_PRECISION = 7;

exports.uploadGPX = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  try {
    const gpx = new GpxParser();
    gpx.parse(req.file.buffer.toString());

    const track = gpx.tracks[0];
    if (!track) return res.status(400).json({ msg: 'No track found in GPX' });

    const route = track.points.map(p => ({ lat: p.lat, lng: p.lon }));
    const distance = track.distance.total / 1000; // km
    const duration = (new Date(track.points[track.points.length - 1].time) - new Date(track.points[0].time)) / 1000; // seconds
    const avgPace = (duration / 60) / distance;

    // Create run
    const newRun = new Run({
      user: req.user.id,
      distance: distance.toFixed(2),
      duration,
      avgPace: avgPace.toFixed(2),
      route,
    });

    const run = await newRun.save();

    // Capture tiles logic (similar to tileController)
    const uniqueGeohashes = new Set();
    route.forEach(p => {
      uniqueGeohashes.add(ngeohash.encode(p.lat, p.lng, GEOHASH_PRECISION));
    });

    for (const hash of uniqueGeohashes) {
      let tile = await Tile.findOne({ geoHash: hash });
      if (!tile) {
        tile = new Tile({ owner: req.user.id, geoHash: hash, value: 1 });
      } else if (tile.owner.toString() !== req.user.id) {
        tile.history.push({ owner: tile.owner, timestamp: tile.capturedAt });
        tile.owner = req.user.id;
        tile.capturedAt = Date.now();
      }
      await tile.save();
    }

    // Update user stats
    const user = await User.findById(req.user.id);
    user.totalDistance += parseFloat(distance.toFixed(2));
    user.totalTiles = await Tile.countDocuments({ owner: req.user.id });
    user.runs.push(run.id);
    await user.save();

    res.json({ msg: 'GPX uploaded and processed successfully', run });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
