const mongoose = require('mongoose');

const response = (status, data) => {
  const results = { status }

  if (status) {
    results.data = data;
  }
  else {
    results.message = data;
  }

  return results;
}

const isID = (id) => {
  return mongoose.isValidObjectId(id);
}

module.exports = { response, isID };