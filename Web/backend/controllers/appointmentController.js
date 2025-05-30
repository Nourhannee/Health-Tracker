const Appointment = require("../models/Appointment");
const mongoose = require("mongoose"); // Needed for ObjectId validation

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res, next) => {
  try {
    const { title, date, location, notes } = req.body;
    const appointment = await Appointment.create({
      user: req.user.id,
      title,
      date: new Date(date), // Ensure date is stored as Date object
      location,
      notes,
    });
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error("Create Appointment error:", error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get all appointments for logged in user
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    // Optionally filter by date range (e.g., using query params ?startDate=...&endDate=...)
    const appointments = await Appointment.find({ user: req.user.id }).sort({ date: 1 }); // Sort by date ascending
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    console.error("Get Appointments error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointmentById = async (req, res, next) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid appointment ID format" });
        }

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Ensure the appointment belongs to the logged-in user
        if (appointment.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Not authorized to access this appointment" });
        }

        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        console.error("Get Appointment By ID error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// @desc    Update an appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid appointment ID format" });
    }

    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Ensure user owns the appointment
    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized to update this appointment" });
    }

    // Fields allowed to be updated
    const { title, date, location, notes, status } = req.body;
    const fieldsToUpdate = {};
    if (title) fieldsToUpdate.title = title;
    if (date) fieldsToUpdate.date = new Date(date);
    if (location) fieldsToUpdate.location = location;
    if (notes) fieldsToUpdate.notes = notes;
    if (status) fieldsToUpdate.status = status;

    appointment = await Appointment.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.error("Update Appointment error:", error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid appointment ID format" });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Ensure user owns the appointment
    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized to delete this appointment" });
    }

    await appointment.deleteOne(); // Use deleteOne() or remove()

    res.status(200).json({ success: true, data: {} }); // Return empty object on successful deletion
  } catch (error) {
    console.error("Delete Appointment error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

