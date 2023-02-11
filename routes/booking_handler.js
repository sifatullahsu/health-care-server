const express = require('express');
const mongoose = require('mongoose');
const bookingSchema = require('../schemas/booking_schema');

const router = express.Router();
const Booking = new mongoose.model('Booking', bookingSchema);





module.exports = router;