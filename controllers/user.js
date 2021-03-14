const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse.js");
const Customer = require("../models/customer");
const crypto = require("crypto");

//--------------------------REGISTER customer-----------------

exports.register = asyncHandler(async (req, res, next) => {
  const { fname,lname,email,password } = req.body;
  const customer = await customer.create({
   fname,
   lname,
   email,
   password,
  });

  sendTokenResponse(customer, 200, res);
});

//-------------------LOGIN-------------------

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide customername and password"), 400);
  }

  // Check customer
  const customer = await Customer.findOne({ email: email }).select("+password");
  //because in password field we have set the property select:false , but here we need as password so we added + sign

  if (!customer) {
    res
    .status(201)
    .json({
      success: false,
      message: 'Invalid credentails customer',
    });  
  }

  // const isMatch = await customer.matchPassword(password); // decrypt password
  
  if (customer.password!= password) {
    res
    .status(201)
    .json({
      success: false,
      message: 'Invalid credentails',
    });
  }
 else{
  sendTokenResponse(customer, 200, res);
}
});

//------------------LOGOUT--------------
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: "customer Logged out",
  });
});

//-------------------------CURRENT customer DETAILS-----------

exports.getMe = asyncHandler(async (req, res, next) => {
  const customer = await customer.findById(req.customer.id);
  res.status(200).json({
    success: true,
    data: customer,
  });
});

// Get token from model , create cookie and send response
const sendTokenResponse = (customer, statusCode, res) => {
 
  const token = customer.getSignedJwtToken();

  const options = {
    //Cookie will expire in 30 days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Cookie security is false .if you want https then use this code. do not use in development time
  if (process.env.NODE_ENV === "proc") {
    options.secure = true;
  }

  //we have created a cookie with a token
  res
    .status(statusCode)
    .cookie("token", token, options) // key , value ,options
    .json({
      success: true,
      token,
    });

};
