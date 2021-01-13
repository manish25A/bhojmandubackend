const mongoose = require('mongoose');
const Product = mongoose.model('Product', {
    name: { type: String },
    description: { type: String },
    price: { type: String },
    pqty: { type: String },
});
module.exports = Product;
