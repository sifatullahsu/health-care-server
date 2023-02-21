const express = require('express');
const mongoose = require('mongoose');
const appointmentSchema = require('../schemas/appointment_schema');
const stripe = require('stripe')(process.env.STRIPE_SK);

const router = express.Router();
const Appointment = new mongoose.model('Appointment', appointmentSchema);


router.post('/create-payment-intent', async (req, res) => {

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "USD",
      amount: 2000,
      automatic_payment_methods: { enabled: true }
    });

    res.send({
      publishableKey: process.env.STRIPE_PK,
      clientSecret: paymentIntent.client_secret
    });

  } catch (e) {
    console.log(e);
  }

});


router.post('/create', async (req, res) => {

  console.log(req.body);

  const newDocument = new Appointment(req.body);
  await newDocument.save((err) => {
    if (err) {
      res.json({
        status: false,
        // message: 'There was a server side error!'
        message: err
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