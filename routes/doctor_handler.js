const express = require('express');
const mongoose = require('mongoose');
const doctorSchema = require('../schemas/service_schema');

const router = express.Router();
const Doctor = new mongoose.model('Doctor', doctorSchema);



module.exports = router;