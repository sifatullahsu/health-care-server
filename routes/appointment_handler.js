const express = require('express');
const mongoose = require('mongoose');
const appointmentSchema = require('../schemas/appointment_schema');

const router = express.Router();
const Appointment = new mongoose.model('Appointment', appointmentSchema);


router.post('/create', async (req, res) => {
  const newDocument = new Appointment(req.body);
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