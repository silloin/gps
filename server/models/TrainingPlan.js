const mongoose = require('mongoose');

const TrainingPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planType: { type: String, enum: ['beginner', '5k', '10k'], required: true },
  workouts: [
    {
      day: { type: Number, required: true },
      workoutType: { type: String, required: true },
      duration: { type: Number },
      distance: { type: Number },
      completed: { type: Boolean, default: false },
    },
  ],
  startDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TrainingPlan', TrainingPlanSchema);
