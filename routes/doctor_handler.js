const express = require('express');
const mongoose = require('mongoose');
const { response } = require('../helpers/halpers');
const doctorSchema = require('../schemas/doctor_schema');
const serviceSchema = require('../schemas/service_schema');

const router = express.Router();
const Doctor = new mongoose.model('Doctor', doctorSchema);
const Service = new mongoose.model('Service', serviceSchema);


router.post('/create', async (req, res) => {
  const newDocument = new Doctor(req.body);
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
  const result = await Doctor.updateOne(query, { $set: req.body });

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
    const results = await Doctor.find(query).skip(skip).limit(size).sort({ _id: -1 });

    const count = await Doctor.countDocuments(query);
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
    const query = { _id: id }
    const results = await Doctor.findOne(query).populate({ path: 'user', select: { name: 1, email: 1, role: 1 } });

    res.send(results ? response(true, results) : response(false, 'Data not found!'));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }

});


router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    let query = { name: new RegExp(name, 'i') }
    if (name === 'all') query = {}

    const results = await Doctor.find(query).select({ name: 1, email: 1 });

    const dataProcess = await Promise.all(results?.map(async (i) => {
      const results = await Service.findOne({ doctors: { $elemMatch: { $eq: i._id } } }).select({ _id: 1 });

      return ({ value: i._id, label: `${i.name} (${i.email})`, isDisabled: results ? true : false });
    }));

    res.send(results ? response(true, dataProcess) : response(false, 'Data not found!'));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }
});


module.exports = router;