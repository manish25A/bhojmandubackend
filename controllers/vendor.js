const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse.js');
const Vendor = require('../models/Vendor');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

//--------------------------REGISTER customer-----------------

exports.vendorRegister = asyncHandler(async (req, res, next) => {
	const { vendorName, vendorEmail, vendorAddress } = await req.body;
	const salt = await bcrypt.genSaltSync(10);
	const hashedPassword = await bcrypt.hash(req.body.vendorPassword, salt);
	// console.log(hashedPassword);
	const vendor = await Vendor.create({
		vendorName,
		vendorEmail,
		vendorAddress,
		vendorPassword: hashedPassword,
	});

	sendTokenResponse(vendor, 200, res);
});
//-------------------Display all vendors

exports.getVendors = asyncHandler(async (req, res, next) => {
	const vendors = await Vendor.find({}).select();

	res.status(201).json({
		success: true,
		count: vendors.length,
		data: vendors,
	});
});
//-------------------LOGIN-------------------

//logintemp
exports.vendorLogin = asyncHandler(async (req, res, next) => {
	const { vendorEmail, vendorPassword } = req.body;

	if (!vendorEmail || !vendorPassword) {
		return next(
			new ErrorResponse('Please provide vendor email and password'),
			400
		);
	}

	// Check vendor
	const vendor = await Vendor.findOne({ vendorEmail: vendorEmail }).select(
		'+vendorPassword'
	);
	//because in password field we have set the property select:false , but here we need as password so we added + sign

	if (!vendor) {
		res.status(201).json({
			success: false,
			message: 'Vendor not found',
		});
	}
	bcrypt.compare(vendorPassword, vendor.vendorPassword, function (err, result) {
		if (result === false) {
			return res
				.status(403)
				.json({ success: false, message: 'Invalid password ' });
		} else {
			sendTokenResponse(vendor, 200, res);
		}
	});
});
//------------------LOGOUT--------------
exports.vendorLogout = asyncHandler(async (req, res, next) => {
	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		data: 'vendor Logged out',
	});
});

//-------------------------CURRENT customer DETAILS-----------

exports.getVendor = asyncHandler(async (req, res, next) => {
	const vendor = await Vendor.findById(req.user._id);
	res.status(200).json({
		success: true,
		data: vendor,
	});
});

// Get token from model , create cookie and send response
const sendTokenResponse = (vendor, statusCode, res) => {
	const token = vendor.getVendorSignedJwtToken();
	const id = vendor.getId();
	const options = {
		//Cookie will expire in 30 days
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	// Cookie security is false .if you want https then use this code. do not use in development time
	if (process.env.NODE_ENV === 'proc') {
		options.secure = true;
	}

	//we have created a cookie with a token
	res
		.status(statusCode)
		.cookie('token', token, id, options) // key , value ,options
		.json({
			success: true,
			token,
			id,
		});
};

//update vendor
exports.vendorUpdate = asyncHandler(async (req, res, next) => {
	const vendorId = req.user._id;
	vendorPassword = req.body.vendorPassword;

	Vendor.findOne({ _id: vendorId }).then((sellerDisplay) => {
		bcrypt.hash(vendorPassword, 10, function (err, hash) {
			Vendor.updateOne({ _id: vendorId }, { vendorPassword: hash })
				.then(function (result) {
					console.log(result);
					res.status(200).json({
						data: 'password updated successfully',
						success: true,
						result: result,
					});
				})
				.catch((err) => {
					console.log(err);
					res.status(500).json({
						data: 'update failed',
						success: false,
					});
				});
		});
	});
});

//vendor image upload

// ------------------UPLOAD IMAGE-----------------------

exports.vendorImageUpload = asyncHandler(async (req, res, next) => {
	const vendor = await Vendor.findById(req.params.id);

	console.log(vendor);
	if (!vendor) {
		return next(new ErrorResponse(`No data found with ${req.params.id}`), 404);
	}

	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 400));
	}

	const file = req.files.file;

	// Make sure the image is a photo and accept any extension of an image
	// if (!file.mimetype.startsWith("image")) {
	//   return next(new ErrorResponse(`Please upload an image`, 400));
	// }

	// Check file size
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
				400
			)
		);
	}

	file.name = `photo_${product.id}${path.parse(file.name).ext}`;

	await file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.err(err);
			return next(new ErrorResponse(`Problem with file upload`, 500));
		}

		//insert the filename into database
		await Vendor.findByIdAndUpdate(req.params.id, {
			photo: file.name,
		});
	});

	res.status(200).json({
		success: true,
		data: file.name,
	});
});
