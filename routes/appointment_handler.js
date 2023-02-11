const express = require('express');
const mongoose = require('mongoose');
const appointmentSchema = require('../schemas/appointment_schema');

const router = express.Router();
const Appointment = new mongoose.model('Appointment', appointmentSchema);





module.exports = router;