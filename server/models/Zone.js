const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  totalTiles: { type: Number, default: 0 },
  king: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  queen: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tile' }],
});

module.exports = mongoose.model('Zone', ZoneSchema);
