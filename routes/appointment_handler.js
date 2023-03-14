const express = require('express');
const mongoose = require('mongoose');
const { response } = require('../helpers/halpers');
const appointmentSchema = require('../schemas/appointment_schema');
const stripe = require('stripe')(process.env.STRIPE_SK);

const router = express.Router();
const Appointment = new mongoose.model('Appointment', appointmentSchema);


router.post('/create-payment-intent', async (req, res) => {

  const { price } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "USD",
      amount: price * 100,
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


router.get('/list', async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const skip = (page - 1) * size;

  try {
    const query = {}
    const results = await Appointment.find(query).skip(skip).limit(size).sort({ _id: -1 });

    const count = await Appointment.countDocuments(query);
    const total = Math.ceil(count / size);

    const pagination = {
      totalPage: total,
      currentPage: page,
      documentsSize: size,
      totalDocuments: count,
      start: skip + 1,
      end: skip + results.length
    }

    res.send(response(true, results, pagination));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }

});


router.get('/list/:id', async (req, res) => {

  const { id } = req.params;

  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const skip = (page - 1) * size;

  try {
    const query = { "metaInfo.author": id }
    const results = await Appointment.find(query).skip(skip).limit(size).sort({ _id: -1 });

    const count = await Appointment.countDocuments(query);
    const total = Math.ceil(count / size);

    const pagination = {
      totalPage: total,
      currentPage: page,
      documentsSize: size,
      totalDocuments: count,
      start: skip + 1,
      end: skip + results.length
    }

    res.send(response(true, results, pagination));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }

});


router.get('/list/doctor/:id', async (req, res) => {

  const { id } = req.params;

  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const skip = (page - 1) * size;

  try {
    const query = { "doctor._id": id }
    const results = await Appointment.find(query).skip(skip).limit(size).sort({ _id: -1 });

    const count = await Appointment.countDocuments(query);
    const total = Math.ceil(count / size);

    const pagination = {
      totalPage: total,
      currentPage: page,
      documentsSize: size,
      totalDocuments: count,
      start: skip + 1,
      end: skip + results.length
    }

    res.send(response(true, results, pagination));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }

});


router.get('/dash-data/:id', async (req, res) => {

  const { id } = req.params;
  const date = new Date().getTime();

  try {
    const query = { "metaInfo.author": id }
    const select = { "payment.amount": 1, date: 1, slot: 1, _id: 0 }
    const results = await Appointment.find(query).select(select).sort({ _id: -1 });

    const data = {
      totalSpend: 0,
      appointments: {
        total: results.length,
        upcoming: 0,
        completed: 0
      }
    }

    for (const i of results) {
      data.totalSpend = data.totalSpend + parseFloat(i.payment.amount);

      const appointmentDate = new Date(`${i.date} ${i.slot.split(' - ')[1]}`).getTime();

      if (appointmentDate - date > 0) {
        data.appointments.upcoming += 1;
      }
      else {
        data.appointments.completed += 1;
      }
    }

    res.send(response(true, data));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }

});


router.get('/single/:id', async (req, res) => {

  try {
    const { id } = req.params;
    const query = { _id: id }
    const results = await Appointment.findOne(query).select({ __v: 0 });

    res.send(results ? response(true, results) : response(false, 'Data not found!'));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }

});


module.exports = router;