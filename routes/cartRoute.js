const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');

const { createCartItem } = require('../controllers/cart');

router.route('/product/:id/insert').post(protect, createCartItem);

module.exports = router;
