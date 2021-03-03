const mongoose = require('mongoose');
const Resturant = mongoose.model('Resturant', {
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
	ResturantEmail: {
		type: String,
		require: true,
		unique: true,
	},
	ResturantPhone: {
		type: String,
		require: true,
	},
	ResturantPassword: {
		type: String,
		require: true,
	},	
	ResturantLogo: {
		type: String,
		require: true,
	},
});
module.exports = Resturant;
