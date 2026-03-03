const mongoose = require('mongoose');

const RunSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  distance: { type: Number, required: true },
  duration: { type: Number, required: true },
  avgPace: { type: Number, required: true },
  route: [{ lat: Number, lng: Number }],
  tiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tile' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Run', RunSchema);
