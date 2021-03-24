const crypto = require('crypto'); //to generate the token and hash it
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
SALT_WORK_FACTOR = 10;
(MAX_LOGIN_ATTEMPTS = 5), (LOCK_TIME = 2 * 60 * 60 * 1000);

const CustomerSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, 'Enter first name'],
  },
  lname: {
    type: String,
    required: [true, 'Enter last name'],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Enter email'],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false, // it will not return the password when quering
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  //   loginAttempts:{type:Number, required:true,default:0},
  // lockUntil:{type:Number}
});

CustomerSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2,
};
CustomerSchema.virtual('isLocked').get(function () {
  // check for a future lockUntil timestamp
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

CustomerSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Match customer entered password to hashed password in database
CustomerSchema.methods.matchPassword = async (password, hashPassword) => {
  return await bcrypt.compareSync(password, hashPassword);
};

//Generate and hash password token
CustomerSchema.methods.getResetPasswordToken = function () {
  //Generate the token
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //set expire time to 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('Customer', CustomerSchema);
