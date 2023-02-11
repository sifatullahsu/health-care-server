const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: Number, trim: true, required: true, unique: true },
  qualifications: { type: String, trim: true, required: true },
  designation: { type: Number, trim: true, required: true },
  image: { type: String, trim: true, required: true },
  slots: [
    { type: String, trim: true, required: true }
  ],
  about: { type: Number, trim: true, required: true },
});

module.exports = doctorSchema;