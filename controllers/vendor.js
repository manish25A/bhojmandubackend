const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse.js");
const Vendor = require("../models/Vendor");
const crypto = require("crypto");

//--------------------------REGISTER customer-----------------

exports.vendorRegister = asyncHandler(async (req, res, next) => {
    const { vendorName,vendorEmail,vendorPassword,vendorAddress } = req.body;
    const vendor = await Vendor.create({
        vendorName,
        vendorEmail,
        vendorPassword,
        vendorAddress,
    });

    sendVendorTokenResponse(vendor, 200, res);
});

//-------------------LOGIN-------------------

exports.vendorLogin = asyncHandler(async (req, res, next) => {
    const { vendorEmail, vendorPassword } = req.body;

    if (!vendorEmail || !vendorPassword) {
        return next(new ErrorResponse("Please provide customer email and password"), 400);
    }

    // Check customer
    const vendor = await Vendor.findOne({ vendorEmail: vendorEmail }).select("+vendorPassword");
    //because in password field we have set the property select:false , but here we need as password so we added + sign

    if (!vendor) {
        res
            .status(201)
            .json({
                success: false,
                message: 'Invalid credentials of vendor',
            });
    }

    // const isMatch = await customer.matchPassword(password); // decrypt password

    if (vendor.vendorPassword!== vendor) {
        res
            .status(201)
            .json({
                success: false,
                message: 'Invalid credentials',
            });
    }
    else{
        sendVendorTokenResponse(vendor, 200, res);
    }
});

//------------------LOGOUT--------------
exports.vendorLogout = asyncHandler(async (req, res, next) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: "vendor Logged out",
    });
});

//-------------------------CURRENT customer DETAILS-----------

exports.getVendor = asyncHandler(async (req, res, next) => {
    const customer = await Vendor.findById(req.vendor.id);
    res.status(200).json({
        success: true,
        data: customer,
    });
});

// Get token from model , create cookie and send response
const sendVendorTokenResponse = (vendor, statusCode, res) => {

    const token = vendor.getSignedJwtToken();

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
