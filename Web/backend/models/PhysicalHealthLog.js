const mongoose = require("mongoose");

const PhysicalHealthLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  activityType: {
    type: String,
    required: [true, "Please add an activity type"],
    trim: true,
  },
  durationMinutes: {
    type: Number,
    required: [true, "Please add the duration in minutes"],
    min: [1, "Duration must be at least 1 minute"],
  },
  caloriesBurned: {
    type: Number,
    min: [0, "Calories burned cannot be negative"],
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PhysicalHealthLog", PhysicalHealthLogSchema);