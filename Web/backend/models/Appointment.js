const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please add an appointment title"],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "Please add an appointment date and time"],
  },
  location: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optional: Add index for faster querying by user and date
AppointmentSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("Appointment", AppointmentSchema);

