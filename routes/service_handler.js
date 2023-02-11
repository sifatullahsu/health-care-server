const express = require('express');
const mongoose = require('mongoose');
const serviceSchema = require('../schemas/service_schema');

const router = express.Router();
const Service = new mongoose.model('Service', serviceSchema);


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
    const results = await Service.find(query).skip(skip).limit(size).sort({ _id: -1 });

    res.send(response(true, results));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }

});


router.get('/single/:id', async (req, res) => {

  try {
    const { id } = req.params;
    const query = { _id: id }
    const results = await Service.findOne(query);

    res.send(results ? response(true, results) : response(false, 'Data not found!'));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }

});


module.exports = router;