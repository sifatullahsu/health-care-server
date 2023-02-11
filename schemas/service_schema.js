const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
  name: { type: String, trim: true, required: true },
  price: { type: Number, trim: true, required: true },
  doctors: [
    { type: mongoose.Types.ObjectId, ref: 'Doctor', required: true }
  ]
});

module.exports = serviceSchema;
