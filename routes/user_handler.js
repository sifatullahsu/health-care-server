const express = require('express');
const mongoose = require('mongoose');
const { response } = require('../helpers/halpers');
const doctorSchema = require('../schemas/doctor_schema');
const userSchema = require('../schemas/user_schema');

const router = express.Router();
const Doctor = new mongoose.model('Doctor', doctorSchema);
const User = new mongoose.model('User', userSchema);


router.post('/create', async (req, res) => {
  const newDocument = new User(req.body);
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

router.get('/single/:uid', async (req, res) => {

  try {
    const { uid } = req.params;
    const query = { uid: uid }
    const results = await User.findOne(query).select({ __v: 0 });

    let doctorData = undefined;

    if (results?.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: results?._id }).select({ user: 0, __v: 0 });
      doctorData = doctor;
    }

    const data = doctorData === undefined ? results : { ...results.toObject(), doctor: doctorData };

    res.send(results ? response(true, data) : response(false, 'Data not found!'));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }

});

router.get('/list', async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const skip = (page - 1) * size;

  try {
    const query = {}
    const results = await User.find(query).skip(skip).limit(size).sort({ _id: -1 });

    const count = await User.countDocuments(query);
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

router.patch('/edit/:id', async (req, res) => {

  const query = { _id: req.params.id }
  const result = await User.updateOne(query, { $set: req.body });

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

router.get('/associat-doctor', async (req, res) => {
  try {
    const { name } = req.query;
    let query = { $and: [{ name: new RegExp(name, 'i') }, { role: 'doctor' }] }
    if (name === 'all') query = { role: 'doctor' }

    const results = await User.find(query).select({ name: 1, email: 1, role: 1 });

    const dataProcess = await Promise.all(results?.map(async (i) => {
      // const results = await Doctor.findOne({ user: { $elemMatch: { $eq: i._id } } }).select({ _id: 1 });
      const results = false;

      return ({ value: i._id, label: `${i.name} (${i.email}) - ${i.role}`, isDisabled: results ? true : false });
    }));

    res.send(results ? response(true, dataProcess) : response(false, 'Data not found!'));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }
});


module.exports = router;