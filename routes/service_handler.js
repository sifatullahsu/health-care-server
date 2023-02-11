const express = require('express');
const mongoose = require('mongoose');
const serviceSchema = require('../schemas/service_schema');

const router = express.Router();
const Service = new mongoose.model('Service', serviceSchema);


router.get('/', (req, res) => {
  res.send('Hi');
});


module.exports = router;