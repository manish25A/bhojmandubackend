const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const crypto = require("crypto"); //to generate the token and hash it
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const VendorSchema = new mongoose.Schema({
        vendorName : {
                type : String,
                required : [true,'Enter restaurant name']
        },
        vendorEmail : {
                type: String,
                unique : true,
                trim : true,
                require:[true,'Enter email']
        },
        vendorPassword: {
                type: String,
                required: [true, "Please add a password"],
                minlength: 6,
                select: false, // it will not return the password when quering
        },
        vendorAddress:{
                type:String,
                required:[true,"Please add address"],
                trim:true
        },
        photo:{
                type:String,
                default:"no-photo.jpg"
        },
        createdAt: {
                type: Date,
                default: Date.now,
        }
});

VendorSchema.methods.getSignedJwtToken = function () {
        return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE,
        });
};

//Match customer entered password to hashed password in database
VendorSchema.methods.matchPassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
};

//Generate and hash password token
VendorSchema.methods.getResetPasswordToken = function () {
        //Generate the token
        const resetToken = crypto.randomBytes(20).toString("hex");

        this.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        //set expire time to 10 minutes
        this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        return resetToken;
};

module.exports = mongoose.model("Vendor", VendorSchema);