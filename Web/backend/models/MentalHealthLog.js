const mongoose = require("mongoose");

const MentalHealthLogSchema = new mongoose.Schema({
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
  mood: {
    type: String,
    required: [true, "Please record your mood"],
    enum: ["Happy", "Sad", "Anxious", "Stressed", "Calm", "Neutral", "Other"], // Example moods
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10, // Example scale 1-10
  },
  sleepHours: {
    type: Number,
    min: 0,
  },
  journalEntry: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MentalHealthLog", MentalHealthLogSchema);

