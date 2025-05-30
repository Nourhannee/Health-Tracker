const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { username, email, password, fullName } = req.body;

  try {
    // Check if user already exists
    console.log(`[Register] Finding user by email: ${email}`);
    let user = await User.findOne({ email });
    if (user) {
      console.log(`[Register] User found with email: ${email}`);
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    console.log(`[Register] Finding user by username: ${username}`);
    user = await User.findOne({ username });
    if (user) {
      console.log(`[Register] User found with username: ${username}`);
      return res.status(400).json({ success: false, message: "Username already taken" });
    }

    // Create user
    console.log(`[Register] Attempting to create user: ${JSON.stringify({ username, email, fullName })}`);
    user = await User.create({
      username,
      email,
      password,
      fullName, // Add other fields as needed
    });
    console.log(`[Register] User created successfully: ${user._id}`);

    // Create token
    const token = generateToken(user._id);
    console.log(`[Register] Token generated for user: ${user._id}`);

    res.status(201).json({
      success: true,
      token,
      user: { // Send back some user info, excluding password
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    // Enhanced error logging BEFORE sending response
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("[Register] Error occurred:");
    console.error(`[Register] Error Name: ${error.name}`);
    console.error(`[Register] Error Message: ${error.message}`);
    // Log specific Mongoose validation errors if available
    if (error.name === 'ValidationError') {
        console.error("[Register] Validation Errors:", JSON.stringify(error.errors, null, 2));
    }
    // Log the full stack trace for more details
    console.error("[Register] Error Stack:", error.stack);
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    
    // Now send the response
    res.status(500).json({ success: false, message: "Server Error" });
    // next(error); // Or pass to error handling middleware
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please provide email and password" });
  }

  try {
    // Check for user by email, include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Create token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: { // Send back some user info, excluding password
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error("[Login] Login error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
    // next(error);
  }
};

// @desc    Get current logged in user (Example protected route)
// @route   GET /api/auth/me
// @access  Private
// exports.getMe = async (req, res, next) => {
//   // This route would require authentication middleware to be implemented first
//   // The middleware would attach the user object to req.user
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }
//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     console.error("GetMe error:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

