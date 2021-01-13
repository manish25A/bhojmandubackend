const mongoose = require('mongoose');
const Customer = mongoose.model('Customer', {
    fName: { type: String }.toString().trim(),
    lName: { type: String },
    email: { type: String },
    mobileNumber: { type: String },
    password: { type: String },
});
module.exports = Customer;
