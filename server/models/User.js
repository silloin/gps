const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String },
  totalDistance: { type: Number, default: 0 },
  totalTiles: { type: Number, default: 0 },
  weeklyMileage: { type: Number, default: 0 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  runs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Run' }],
  tiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tile' }],
  trainingPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingPlan' },
  achievements: [String],
});

module.exports = mongoose.model('User', UserSchema);
