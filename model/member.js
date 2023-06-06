const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  stdID: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\+?\d{10,14}$/
  },
  address: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
