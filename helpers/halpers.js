const mongoose = require('mongoose');

const response = (status, data, pagination) => {
  const results = { status }

  if (status) {
    results.data = data;

    if (pagination) {
      results.pagination = pagination;
    }
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