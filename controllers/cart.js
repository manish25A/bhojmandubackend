const ErrorResponse = require('../utils/errorResponse');
const Cart = require('../models/cart');
const asyncHandler = require('../middleware/async');
//To get the file name extension line .jpg,.png
const path = require('path');

//--------------------CREATE cart data------------------

exports.createCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.create({
    itemId: req.params.id,
    userId: req.user._id,
  });

  if (!cart) {
    return next(new ErrorResponse('Error adding cart'), 404);
  }

  res.status(201).json({
    success: true,
    data: cart,
  });
});

//-------------------Display all cart items

exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.find({})
    .select()
    .populate({
      path: 'userId',
      match: { id: req.params.id },
    });

  res.status(201).json({
    success: true,
    count: cart.length,
    data: cart,
  });
});
