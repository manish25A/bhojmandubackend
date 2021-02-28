const mongoose = require('mongoose');
const Customer = mongoose.model('Customer', {
  CustomerFullName: {
    type: String,
    required: true,
  },
  CustomerAge: {
    type: Number,
    required: true,
  },
  CustomerEmail: {
    type: String,
    required: true,
    unique: true,
  },
  CustomerPhone: {
    type: String,
    required: true,
  },
  CustomerGender: {
    type: String,
    required: true,
  },
  CustomerPassword: {
    type: String,
    required: true,
  },
});
module.exports = Customer;
