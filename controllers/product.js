const ErrorResponse = require("../utils/errorResponse");
const Student = require("../models/product");
const asyncHandler = require("../middleware/async");
//To get the file name extension line .jpg,.png
const path = require("path");


//--------------------CREATE Student------------------

exports.createProduct = asyncHandler(async (req, res, next) => {

  const product = await Student.create({...req.body,vendor:req.user._id});

  if (!product) {
    return next(new ErrorResponse("Error adding student"), 404);
  }

  res.status(201).json({
    success: true,
    data: product,
  });
});

//-------------------Display all products


exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Student.find({}).select('vendor');

  res.status(201).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// -----------------FIND Student BY ID-------------------

exports.getStudentById = asyncHandler(async (req, res, next) => {
  const student = await Student.findById({_id:req.params.id, vendor:req.user._id}).populate('customer');

  if (!student) {
    return next(new ErrorResponse("Student not found"), 404);
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

// -----------------DELETE STUDENT------------------------

exports.deleteStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new ErrorResponse(`No student found `), 404);
  }

  await student.remove();

  res.status(200).json({
    success: true,
    count: student.length,
    data: {},
  });
});

// ------------------UPLOAD IMAGE-----------------------

exports.StudentPhotoUpload = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  console.log(student);
  if (!student) {
    return next(new ErrorResponse(`No student found with ${req.params.id}`), 404);
  }


  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo and accept any extension of an image
  // if (!file.mimetype.startsWith("image")) {
  //   return next(new ErrorResponse(`Please upload an image`, 400));
  // }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
        new ErrorResponse(
            `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
            400
        )
    );
  }

  file.name = `photo_${student.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.err(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    //insert the filename into database
    await Student.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });
  });

  res.status(200).json({
    success: true,
    data: file.name,
  });
});