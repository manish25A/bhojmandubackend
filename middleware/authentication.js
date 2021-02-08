const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Seller = require('../model/SellerModel');
const Buyer = require('../model/BuyerModel');

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

module.exports.verifyBuyer = function (req, res, next) {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodeData = jwt.verify(token, 'secretkey');
		Buyer.findOne({ _id: decodeData.buyerId })
			.then(function (BuyerAuthenticateData) {
				////validated
				req.buyer = BuyerAuthenticateData;
				next();
			})
			.catch(function (error) {
				res.status(401).json({ message: error });
			});
	} catch (error) {
		res.status(401).json({ message: error + 'Unauthorized Access' });
	}
};
