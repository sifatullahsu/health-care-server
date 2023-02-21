const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
  date: { type: String, trim: true, required: true },
  slot: { type: String, trim: true, required: true },
  service: {
    _id: { type: mongoose.Types.ObjectId, ref: 'Doctor', required: true },
    name: { type: String, trim: true, required: true },
    price: { type: Number, trim: true, required: true }
  },
  doctor: {
    _id: { type: mongoose.Types.ObjectId, ref: 'Doctor', required: true },
    name: { type: String, trim: true, required: true }
  },
  patient: {
    name: { type: String, trim: true, required: true },
    age: { type: String, trim: true, required: true },
    number: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true }
  },
  payment: {
    id: { type: String, trim: true, required: true },
    amount: { type: String, trim: true, required: true },
    currency: { type: String, trim: true, required: true }
  },
  // metaInfo: {
  //   author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  //   created: { type: Date, required: true, default: Date.now },
  //   lastModified: { type: Date, required: true, default: Date.now }
  // }
});

module.exports = appointmentSchema;