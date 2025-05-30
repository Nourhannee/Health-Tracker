const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.get("/me", protect, getMe); // Example for protected route later

module.exports = router;

