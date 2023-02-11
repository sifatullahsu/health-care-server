const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
  name: { type: String, trim: true, required: true },
  price: { type: Number, trim: true, required: true },
  doctors: [
    { type: String, trim: true, required: true }
  ]
});

module.exports = serviceSchema;
