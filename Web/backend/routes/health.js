const express = require("express");
const {
  logPhysicalHealth,
  getPhysicalHealthHistory,
  logMentalHealth,
  getMentalHealthHistory,
  getDashboardSummary
} = require("../controllers/healthController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all health routes
router.use(protect);

router.route("/physical")
  .post(logPhysicalHealth)
  .get(getPhysicalHealthHistory);

router.route("/mental")
  .post(logMentalHealth)
  .get(getMentalHealthHistory);

router.route("/dashboard")
  .get(getDashboardSummary);

module.exports = router;