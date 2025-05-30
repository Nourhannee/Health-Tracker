const User = require("../models/User");

// @desc    Get current logged in user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res, next) => {
  // req.user is set by the protect middleware
  try {
    // The user object attached by the middleware might already be sufficient
    // If not, you could re-fetch or populate related data if needed
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
  // Fields to allow updating (exclude password, email, username for simplicity here)
  // Password changes should ideally have a separate route/controller
  const { fullName, dateOfBirth, gender /* add other fields */ } = req.body;
  const fieldsToUpdate = {};
  if (fullName) fieldsToUpdate.fullName = fullName;
  if (dateOfBirth) fieldsToUpdate.dateOfBirth = dateOfBirth;
  if (gender) fieldsToUpdate.gender = gender;
  // Add other updatable fields here

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user
    user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true, // Return the modified document
      runValidators: true, // Run schema validators on update
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("UpdateProfile error:", error);
    // Handle potential validation errors
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

