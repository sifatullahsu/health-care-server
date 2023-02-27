const express = require('express');
const mongoose = require('mongoose');
const { response } = require('../helpers/halpers');
const serviceSchema = require('../schemas/service_schema');
const appointmentSchema = require('../schemas/appointment_schema');
const { format } = require('date-fns');

const router = express.Router();
const Service = new mongoose.model('Service', serviceSchema);
const Appointment = new mongoose.model('Appointment', appointmentSchema);

router.post('/create', async (req, res) => {
  const newDocument = new Service(req.body);
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


router.patch('/edit/:id', async (req, res) => {
  const query = { _id: req.params.id }
  const result = await Service.updateOne(query, { $set: req.body });

  if (result?.acknowledged) {
    res.json({
      status: true,
      message: 'Items updated successful!'
    });
  }
  else {
    res.json({
      status: false,
      message: 'There was a server side error!'
    });
  }
});


router.get('/list', async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const skip = (page - 1) * size;

  try {
    const query = {}
    const populate = { path: 'doctors' }
    const results = await Service.find(query).populate(populate).skip(skip).limit(size).sort({ _id: -1 });

    const count = await Service.countDocuments(query);
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


router.get('/single/:id', async (req, res) => {

  try {
    const { id } = req.params;
    const date = req.query.date || format(new Date(), 'PP');

    const query = { _id: id }
    const results = await Service.findOne(query).populate({ path: 'doctors' });

    for (const [index, doctor] of results.doctors.entries()) {
      const query = { $and: [{ "doctor._id": doctor._id }, { date: date }] }
      const appointments = await Appointment.find(query).select({ date: 1, slot: 1, _id: 0 });

      const slots = results.doctors[index].slots.filter((slot) => !appointments.some(({ slot: slot2 }) => slot === slot2));

      results.doctors[index].slots = slots;
    }

    res.send(results ? response(true, results) : response(false, 'Data not found!'));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }

});


module.exports = router;