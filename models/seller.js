const mongoose = require('mongoose');
const Seller = mongoose.model('Seller', {
	SellerFullName: {
		type: String,
		require: true,
	},
	SellerGender: {
		type: String,
		require: true,
	},
	SellerEmail: {
		type: String,
		require: true,
		unique: true,
	},
	SellerPhone: {
		type: String,
		require: true,
	},
	SellerPassword: {
		type: String,
		require: true,
	},
});
module.exports = Seller;
