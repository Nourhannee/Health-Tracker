const express = require("express");
const { getMe, updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware"); // Import protect middleware

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

router.route("/me")
  .get(getMe)
  .put(updateProfile);

module.exports = router;

