const express = require('express');
const router = express.Router();

const {
	vendorRegister,
	vendorLogin,
	getVendor,
	getVendors,
	vendorLogout,
	vendorUpdate,
	vendorImageUpload,
} = require('../controllers/vendor');

const { vendorprotect } = require('../middleware/vendorauth');

router.post('/register', vendorRegister);
router.route('/').get(getVendors);
router.route('/update').put(vendorprotect, vendorUpdate);
router.route('/photo/:id').put(vendorprotect, vendorImageUpload);
router.post('/login', vendorLogin);
router.get('/me', vendorprotect, getVendor);
router.get('/logout', vendorLogout);

module.exports = router;
