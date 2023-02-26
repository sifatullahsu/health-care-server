const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, trim: true, required: true },
  role: { type: String, trim: true, required: true },
  uid: { type: String, trim: true, required: true },
});

module.exports = userSchema;