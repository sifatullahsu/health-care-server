const express = require('express');
const mongoose = require('mongoose');
const { response } = require('../helpers/halpers');
const userSchema = require('../schemas/user_schema');

const router = express.Router();
const User = new mongoose.model('User', userSchema);

router.post('/create', async (req, res) => {
  const newDocument = new User(req.body);
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

router.get('/single/:uid', async (req, res) => {

  try {
    const { uid } = req.params;
    const query = { uid: uid }
    const results = await User.findOne(query);

    res.send(results ? response(true, results) : response(false, 'Data not found!'));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }

});

router.get('/list', async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const skip = (page - 1) * size;

  try {
    const query = {}
    const results = await User.find(query).skip(skip).limit(size).sort({ _id: -1 });

    res.send(response(true, results));
  }
  catch (error) {
    res.send(response(false, 'There have server side error!'));
  }

});


module.exports = router;