const mongoose = require('mongoose');

const TileSchema = new mongoose.Schema({
  geoHash: { type: String, required: true, index: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  capturedAt: { type: Date, default: Date.now },
  value: { type: Number, default: 1 },
  zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
  history: [
    {
      owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date },
    },
  ],
});

TileSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Tile', TileSchema);
