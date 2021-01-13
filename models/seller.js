const mongoose = require('mongoose');
const Product = mongoose.model('Seller', {
    fName: { type: String },
    lName: { type: String },
    email: { type: String },
    mobileNumber: { type: String },
    password: { type: String },
});
module.exports = Product;
