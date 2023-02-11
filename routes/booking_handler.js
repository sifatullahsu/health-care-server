const express = require('express');
const mongoose = require('mongoose');
const bookingSchema = require('../schemas/booking_schema');

const router = express.Router();
const Booking = new mongoose.model('Booking', bookingSchema);


router.post('/create', async (req, res) => {
  const newDocument = new Booking(req.body);
  await newDocument.save((err) => {
    if (err) {
      res.json({
        status: false,
        message: 'There was a server side error!'
      });
    }
    else {
      res.json({
        status: true,
        message: 'Item created successful!'
      })
    }
  });
});


module.exports = router;