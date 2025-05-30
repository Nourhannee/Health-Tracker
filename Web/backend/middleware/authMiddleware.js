const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  } 
  // Set token from cookie (optional)
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized to access this route (no token)" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to the request object
    req.user = await User.findById(decoded.id).select("-password"); // Exclude password

    if (!req.user) {
        // Handle case where user associated with token no longer exists
        return res.status(401).json({ success: false, message: "Not authorized to access this route (user not found)" });
    }

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ success: false, message: "Not authorized to access this route (token invalid)" });
  }
};

