require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const healthRoutes = require("./routes/health");
const appointmentRoutes = require("./routes/appointments");

// Import error handler (optional, create if needed)
// const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // for parsing application/json

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Mount Routers
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/appointments", appointmentRoutes);

// Basic Route (optional, can be removed if API is root)
app.get("/", (req, res) => {
  res.send("AIU Health Tracker Backend API is running");
});

// Error Handling Middleware (must be last)
// app.use(errorHandler);

// Define Port
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

