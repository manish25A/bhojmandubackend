const express = require('express');
const router = express.Router();

const {
  vendorRegister,
  vendorLogin,
  getVendor,
  getVendors,
  vendorLogout,
} = require('../controllers/vendor');

const { protect } = require('../middleware/vendorauth');

router.post('/register', vendorRegister);
router.route('/').get(getVendors);

router.post('/login', vendorLogin);
router.get('/me', protect, getVendor);
// router.post("/forgotpassword", forgotPassword);
// router.put("/resetpassword/:resettoken", resetPassword);
router.get('/logout', vendorLogout);

module.exports = router;
