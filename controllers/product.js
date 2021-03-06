const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');
const Cart = require('../models/cart');
const asyncHandler = require('../middleware/async');
//To get the file name extension line .jpg,.png
const path = require('path');

//--------------------CREATE product------------------

exports.createProduct = asyncHandler(async (req, res, next) => {
	const product = await Product.create({
		...req.body,
		vendorId: req.user._id,
	});

	if (!product) {
		return next(new ErrorResponse('Error adding product'), 404);
	}

	res.status(201).json({
		success: true,
		data: product,
	});
});

//-------------------Display all products

exports.getProducts = asyncHandler(async (req, res, next) => {
	const products = await Product.find({}).select();

	res.status(201).json({
		success: true,
		count: products.length,
		data: products,
	});
});

//-------------------Display all products of a vendor
exports.getVendorProducts = asyncHandler(async (req, res, next) => {
	const product = await Product.find({}).populate({
		path: 'vendorId',
		match: { vendorName: req.params.vendorName },
	});
	let products = [];
	product.forEach((p) => {
		if (p.vendorId !== null) {
			products.push(p);
		}
	});
	res.status(201).json({
		success: true,
		count: products.length,
		data: products,
	});
});

// -----------------FIND Product BY ID-------------------

exports.getProductById = asyncHandler(async (req, res, next) => {
	const product = await Product.findById({
		_id: req.params.id,
		// vendor: req.user._id,
	}); //.populate('customer');

	if (!product) {
		return next(new ErrorResponse('Products not found'), 404);
	}

	res.status(200).json({
		success: true,
		data: product,
	});
});

// -----------------DELETE product------------------------

exports.deleteProduct = asyncHandler(async (req, res, next) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		return next(new ErrorResponse(`No product found `), 404);
	}

	await product.remove();

	res.status(200).json({
		success: true,
		count: product.length,
		data: {},
	});
});

// ------------------UPLOAD IMAGE-----------------------

exports.productImageUpload = asyncHandler(async (req, res, next) => {
	const product = await Product.findById(req.params.id);

	console.log(product);
	if (!product) {
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
		await Product.findByIdAndUpdate(req.params.id, {
			photo: file.name,
		});
	});

	res.status(200).json({
		success: true,
		data: file.name,
	});
});

//getadmin products
exports.getAdminProducts = asyncHandler(async (req, res, next) => {
	await Product.find({ vendorId: req.user._id })
		.populate('vendorId')
		.then(function (cartItemDisplay) {
			res.status(201).json({
				success: true,
				data: cartItemDisplay,
			});
		})
		.catch((err) => {
			res.status(500).json({ success: false, message: err });
		});
});

//update products
exports.productUpdate = asyncHandler(async (req, res, next) => {
	const productId = req.params.id;
	const { name, price, desc } = req.body;

	Product.findOne({ _id: productId }).then((productUpdate) => {
		Product.updateOne(
			{ _id: productId },
			{ name: name, price: price, desc: desc }
		)
			.then(function (result) {
				console.log(result);
				res.status(200).json({
					data: 'product updated successfully',
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
