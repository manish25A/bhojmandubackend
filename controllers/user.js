const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse.js');
const Customer = require('../models/customer');
const bcrypt = require('bcryptjs');
const router = require('../routes/customerRoute');
const jwt = require('jsonwebtoken');

// --------------------------REGISTER customer-----------------

exports.register = asyncHandler(async (req, res, next) => {
  const { fname, lname, email, password } = await req.body;
  const salt = await bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // console.log(hashedPassword);
  const customer = await Customer.create({
    fname,
    lname,
    email,
    password: hashedPassword,
  });

  sendTokenResponse(customer, 200, res);
});

//logintemp
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse('Please provide customer email and password'),
      400
    );
  }

  // Check customer
  const customer = await Customer.findOne({ email: email }).select('+password');
  //because in password field we have set the property select:false , but here we need as password so we added + sign

  if (!customer) {
    res.status(201).json({
      success: false,
      message: 'Customer not found',
    });
  }
  bcrypt.compare(password, customer.password, function (err, result) {
    if (result === false) {
      return res
        .status(403)
        .json({ success: false, message: 'Invalid password ' });
    } else {
      sendTokenResponse(customer, 200, res);
    }
  });
});
//-------------------LOGIN-------------------

// exports.login = asyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;
//   await Customer.findOne({ email: email }).then(function (customerData) {
//     if (customerData == null) {
//       return res.status(201).json({ success: false, msg: 'Invalid User!!' });
//     }

//     bcrypt.compare(password, customerData.password, function (err, result) {
//       if (result === false) {
//         return res
//           .status(403)
//           .json({ success: false, message: 'Invalid password ' });
//       }
//       Customer.find({ email: email }).then(function (data) {
//         const token = jwt.sign({ id: this._id }, 'secretkey');
//         res.status(200).json({
//           success: true,
//           msg: 'Login Successful',
//           token: token,
//           data: data,
//           id: this._id,
//         });
//       });
//     });
//   });
// });
//------------------LOGOUT--------------
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: 'customer Logged out',
  });
});

//-------------------------CURRENT customer DETAILS-----------

exports.getMe = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.user._id);
  res.status(200).json({
    success: true,
    data: customer,
  });
});

// Get token from model , create cookie and send response
const sendTokenResponse = (customer, statusCode, res) => {
  const token = customer.getSignedJwtToken();
  const id = customer.getId();
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
