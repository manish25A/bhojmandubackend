const express = require('express');
const router = express.Router();
const Product = require('../models/customer');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const middleware = require('../middleware/signupValidator');

//upload with validation
router.post('/register/customer', middleware, function (req, res) {
	const errors = validationResult(req);
	// console.log(errors.array());

	if (!errors.isEmpty()) {
		console.log(errors.array());
		res.send(errors.array());
	} else {
		const fName = req.body.fName;
		const lName = req.body.lName;
		const email = req.body.email;
		const mobileNumber = req.body.mobileNumber;
		const password = req.body.password;
		bcrypt.hash(password, 10, (err, hash) => {
			const me = new Product({
				fName: fName,
				lName: lName,
				email: email,
				mobileNumber: mobileNumber,
				password: hash,
			});
			me.save()
				.then(function () {
					res.send('Successfully Registered as Customer');
				})
				.catch(function (e) {
					res.send(e);
				});
		});
	}
});

//delete
router.delete('/delete/:id', function (req, res) {
	const id = req.params.id;
	Product.deleteOne({ _id: id }).then(() => res.send('deleted'));
});

//display
router.get('/display', (req, res) => {
	Product.find().then((data) => {
		res.send(data);
	});
});
//update
router.put('/update/:id', (req, res) => {
	const id = req.params.id;
	const pprice = req.body.pprice;
	Product.updateOne({ _id: id }, { pprice: pprice }).then(function () {
		res.send('Updated');
	});
});
module.exports = router;
