const mongoose = require("mongoose");
const PhysicalHealthLog = require("../models/PhysicalHealthLog");
const MentalHealthLog = require("../models/MentalHealthLog");

// @desc    Log a physical health activity
// @route   POST /api/health/physical
// @access  Private
exports.logPhysicalHealth = async (req, res, next) => {
  try {
    const { activityType, durationMinutes, caloriesBurned, notes, date } = req.body;
    const log = await PhysicalHealthLog.create({
      user: req.user.id,
      activityType,
      durationMinutes,
      caloriesBurned,
      notes,
      date: date ? new Date(date) : Date.now() // Allow specific date or default to now
    });
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    console.error("Log Physical Health error:", error);
    // Handle potential validation errors
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get physical health history for logged in user
// @route   GET /api/health/physical
// @access  Private
exports.getPhysicalHealthHistory = async (req, res, next) => {
  try {
    // Add pagination later if needed
    const logs = await PhysicalHealthLog.find({ user: req.user.id }).sort({ date: -1 }); // Sort by date descending
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error("Get Physical Health History error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Log a mental health entry
// @route   POST /api/health/mental
// @access  Private
exports.logMentalHealth = async (req, res, next) => {
  try {
    const { mood, stressLevel, sleepHours, journalEntry, date } = req.body;
    const log = await MentalHealthLog.create({
      user: req.user.id,
      mood,
      stressLevel,
      sleepHours,
      journalEntry,
      date: date ? new Date(date) : Date.now()
    });
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    console.error("Log Mental Health error:", error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get mental health history for logged in user
// @route   GET /api/health/mental
// @access  Private
exports.getMentalHealthHistory = async (req, res, next) => {
  try {
    const logs = await MentalHealthLog.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error("Get Mental Health History error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get dashboard summary (example: recent logs)
// @route   GET /api/health/dashboard
// @access  Private
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const recentPhysical = await PhysicalHealthLog.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(5); // Get last 5 physical logs
    const recentMental = await MentalHealthLog.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(5); // Get last 5 mental logs
    
    // You could add more summary data here (e.g., weekly averages, upcoming appointments)

    res.status(200).json({
      success: true,
      data: {
        recentPhysical,
        recentMental,
        // Add other summary data here
      },
    });
  } catch (error) {
    console.error("Get Dashboard Summary error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};