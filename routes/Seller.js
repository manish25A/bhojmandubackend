const express = require('express');
const router = express.Router();
const Product = require('../models/customer');

//upload
router.post('/upload', (req, res) => {
  var myData = new Product(req.body);
  myData.save().then(() => {
    res.send('done');
  });
});

//delete
router.delete('/delete/:id', function (req, res) {
  const id = req.params.id;
  Product.deleteOne({ _id: id }).then(() => res.send('deleted'));
});

//display
router.get('/display', (req, res) => {
  Product.find().then((data) => {
    res.send(data);
  });
});
//update
router.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const pprice = req.body.pprice;
  Product.updateOne({ _id: id }, { pprice: pprice }).then(function () {
    res.send('Updated');
  });
});
module.exports = router;
