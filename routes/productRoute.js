const express = require("express");
const  router = express.Router();

const {
    createProduct,
    getProducts,
    getStudentById,
    deleteStudent,
    StudentPhotoUpload,
} = require("../controllers/product");

const { protect } = require("../middleware/auth");

router
    .route("/")
    .get(protect,getProducts)
    .post(protect,createProduct);

router
    .route("/:id/photo")
    .put(protect, StudentPhotoUpload);

router
    .route("/:id")
    .get(protect,getStudentById)
    .delete(protect, deleteStudent);


module.exports = router



// const express = require('express');
// const router = express.Router();
// const Product = require('../models/product');
// const { check, validationResult } = require('express-validator');
// const authenticateSeller = require('../middleware/auth');
// const fileUpload =require('../middleware/imageUpload');

// ////post vaneko insert ko lagi
// /////inserting product
// router.post(
// 	'/product/insert',
// 	fileUpload,
// 	authenticateSeller.verifycustomer,
// 	function (req, res) {
// 		const ProductName = req.body.ProductName;
// 		const ProductDescription = req.body.ProductDescription;
// 		const ProductImage = req.file.path;
// 		const ProductPrice = req.body.ProductPrice;
// 		const ProductData = new Product({
// 			ProductName:ProductName,
// 			ProductDescription:ProductDescription,
// 			ProductImage:ProductImage,
// 			ProductPrice:ProductPrice,
// 		});
// 		////then vaneko success vayo vaney
// 		////catch vanya error vayo vaney
// 		ProductData.save()
// 			.then(function (productSuccess) {
// 				res.status(201).json({ success: true, message: 'Product Successfully Added' });
// 			})
// 			.catch(function (error) {
// 				res.status(500).json({ message: error });
// 			});
// 	}
// );
// router.put('/product/update', function (req, res) {
// 	const ProductName = req.body.ProductName;
// 	const ProductSize = req.body.ProductSize;
// 	const ProductColor = req.body.ProductColor;
// 	const ProductImage = req.body.ProductImage;
// 	const ProductType = req.body.ProductType;
// 	const ProductPrice = req.body.ProductPrice;
// 	const ProductDescription = req.body.ProductDescription;
// 	const ProductId = req.body.ProductId;
// 	Product.updateOne(
// 	  { _id: ProductId },
// 	  {
// 		ProductName: ProductName,
// 		ProductSize: ProductSize,
// 		ProductColor: ProductColor,
// 		ProductImage: ProductImage,
// 		ProductType: ProductType,
// 		ProductPrice: ProductPrice,
// 		ProductDescription: ProductDescription,
// 	  }
// 	)
// 	  .then(function (productupdate) {
// 		res.status(200).json({ message: 'Product Updated Successfully' });
// 	  })
// 	  .catch(function (error) {
// 		res.status(500).json({ message: error });
// 	  });
//   });
  
//   ////for retriving data
//   ////retriving all data and displaying
//   router.get('/product/all', function (req, res) {
// 	Product.find()
// 	  .then(function (productdisplay) {
// 		res.status(200).json({ success: true, data: productdisplay });
// 	  })
// 	  .catch(function (error) {
// 		res.status(500).json({ success: false, data: error });
// 	  });
//   });

// router.delete(
// 	'/product/delete/:productid',
// 	authenticateSeller.verifySeller,
// 	function (req, res) {
// 		const productid = req.params.productid;
// 		Product.deleteOne({ _id: productid })
// 			.then(function (productdelete) {
// 				res.status(201).json({ message: 'Product Deleted Successfully' });
// 			})
// 			.catch(function (error) {
// 				res.status(500).json({ message: error });
// 			});
// 	}
// );

// module.exports = router;
