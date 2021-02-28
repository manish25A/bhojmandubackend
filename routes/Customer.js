const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
//const authCustomer = require('../middleware/authentication');
const jwt = require('jsonwebtoken');

router.post('/register/customer', function (req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    ////(! vaneko error xa vaney ho)error xa vaney faldey uta postman ma
    res.status(400).json(errors.array());
  } else {
    const CustomerFullName = req.body.CustomerFullName;
    const CustomerAge = req.body.CustomerAge;
    const CustomerEmail = req.body.CustomerEmail;
    const CustomerPhone = req.body.CustomerPhone;
    const CustomerGender = req.body.CustomerGender;
    const CustomerPassword = req.body.CustomerPassword;

    bcrypt.hash(CustomerPassword, 10, function (error, hash) {
      // console.log(hash);
      const Data = new Customer({
        CustomerFullName: CustomerFullName,
        CustomerAge: CustomerAge,
        CustomerEmail: CustomerEmail,
        CustomerPhone: CustomerPhone,
        CustomerGender: CustomerGender,
        CustomerPassword: hash,
      });
      Data.save()
        .then(function () {
          res
            .status(201)
            .json({ success: true, message: 'Successfully Register as Customer' });
        })
        .catch(function (e) {
          /////500 vaneko server error ho
          res.status(500).json({ success: false, message: e });
        });
    });
  }
});

////for Customer login
router.post('/customer/login', function (req, res) {
  const CustomerEmail = req.body.CustomerEmail;
  const CustomerPassword = req.body.CustomerPassword;

  /////mathe vako suru ma initialize gareko Customer ra ysko name same hun aparxa
  Customer.findOne({ CustomerEmail: CustomerEmail }) ////left ko vaneko database ko right ko vaneko yehi mathe initialize gareko hi
    .then(function (CustomerData) {
      if (CustomerData === null) {
        ///return will return back if the valid user doesnot exist and preevents from unnecessary codes to run
        return res
          .status(403)
          .json({ success: false, message: 'Invalid Customer Credentils!!' });
      }
      bcrypt.compare(
        CustomerPassword,
        CustomerData.CustomerPassword,
        function (error, result) {
          ////mathe left ma vako chai form ma vako password and all the data from database are stored in CustomerData
          if (result === false) {
            return res
              .status(403)
              .json({ success: false, message: 'Invalid Credentials!!' });
          }
          // res.send('Valid Credentials!!');

          ///generating tokens

          const CustomerToken = jwt.sign({ CustomerId: CustomerData._id }, 'secretkey');
          return res.status(200).json({
            success: true,
            message: 'Successfully Logged in',
            CustomerToken: CustomerToken,
          });
        }
      );
    })
    .catch();
});

router.get('/Customer/Customerdetail/:Customerid', function (req, res) {
  const Customerid = req.params.Customerid;
  Customer.findOne({ _id: Customerid })
    .then(function (CustomerDisplay) {
      res.status(200).json({ success: true, message: CustomerDisplay });
    })
    .catch(function (error) {
      res.status(500).json({ success: false, message: error });
    });
});

module.exports = router;
