const mongoose = require('mongoose');
const Seller = mongoose.model('Resturant', {
	ResturantFullName: {
		type: String,
		require: true,
	},
	ResturantAddress: {
		type: String,
		require: true,
	},
	ResturantDescription: {
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
	SellerImage: {
		type: Image,
		require: true,
	},
});
module.exports = Seller;
