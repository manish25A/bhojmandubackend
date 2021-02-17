const express = require('express');
const router = express.Router();
const Product = require('../model/ProductModel');
const { check, validationResult } = require('express-validator');
const authenticateSeller = require('../middleware/authentication');

////post vaneko insert ko lagi
/////inserting product
router.post(
	'/product/insert',
	authenticateSeller.verifySeller,
	function (req, res) {
		const ProductName = req.body.ProductName;
		const ProductSize = req.body.ProductSize;
		const ProductColor = req.body.ProductColor;
		const ProductImage = req.body.ProductImage;
		const ProductType = req.body.ProductType;
		const ProductPrice = req.body.ProductPrice;
		const ProductDescription = req.body.ProductDescription;

		const ProductData = new Product({
			ProductName,
			ProductSize,
			ProductColor,
			ProductImage,
			ProductType,
			ProductPrice,
			ProductDescription,
		});
		////then vaneko success vayo vaney
		////catch vanya error vayo vaney
		ProductData.save()
			.then(function (productSuccess) {
				res.status(201).json({ message: 'Product Successfully Added' });
			})
			.catch(function (error) {
				res.status(500).json({ message: error });
			});
	}
);
router.put('/product/update', function (req, res) {
	const _id = req.body._id;
	const ProductName = req.body.ProductName;
	const ProductSize = req.body.ProductSize;
	const ProductColor = req.body.ProductColor;
	const ProductImage = req.body.ProductImage;
	const ProductType = req.body.ProductType;
	const ProductPrice = req.body.ProductPrice;
	const ProductDescription = req.body.ProductDescription;

	Product.updateOne(
		{ _id: _id },
		{
			ProductName: ProductName,
			ProductSize: ProductSize,
			ProductColor: ProductColor,
			ProductImage: ProductImage,
			ProductType: ProductType,
			ProductPrice: ProductPrice,
			ProductDescription: ProductDescription
		}.then(function (result) {
            res.status(200).json({message:"Updated!"})
        })
       .catch(function(e){
             res.status(200).json({message:e});
       })
    })




router.delete(
	'/product/delete/:productid',
	authenticateSeller.verifySeller,
	function (req, res) {
		const productid = req.params.productid;
		Product.deleteOne({ _id: productid })
			.then(function (productdelete) {
				res.status(201).json({ message: 'Product Deleted Successfully' });
			})
			.catch(function (error) {
				res.status(500).json({ message: error });
			});
	}
);

module.exports = router;
