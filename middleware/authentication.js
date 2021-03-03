const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Seller = require('../models/Resturants');
const customer = require('../models/customer');

module.exports.verifySeller = function (req, res, next) {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodeData = jwt.verify(token, 'secretkey');
		Seller.findOne({ _id: decodeData.sellerId })
			.then(function (SellerAuthenticateData) {
				////validated
				req.seller = SellerAuthenticateData;
				next();
			})
			.catch(function (error) {
				res.status(401).json({ message: error });
			});
	} catch (error) {
		res.status(401).json({ message: error + 'Unauthorized Access' });
	}
};

module.exports.verifycustomer = function (req, res, next) {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodeData = jwt.verify(token, 'secretkey');
		customer.findOne({ _id: decodeData.customerId })
			.then(function (customerAuthenticateData) {
				////validated
				req.customer = customerAuthenticateData;
				next();
			})
			.catch(function (error) {
				res.status(401).json({ message: error });
			});
	} catch (error) {
		res.status(401).json({ message: error + 'Unauthorized Access' });
	}
};
