const express = require('express');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const connectDB = require('./bin/database');
const cookieParser = require('cookie-parser');
const path = require('path');
const colors = require('colors');
const errorHandler = require('./middleware/errors');
const dotenv = require('dotenv');
const cors = require('cors');
const createError = require('http-errors');

dotenv.config({
	path: './bin/config.env',
});
// Connect to mongoDB database
connectDB();

// Load routes files
const customerRoute = require('./routes/customerRoute');
const productRoute = require('./routes/productRoute');
const vendorRoute = require('./routes/vendorRoute');
const cartRoute = require('./routes/cartRoute');

const { urlencoded } = require('express');

// initialize out app variable with express
const app = express();
//logger
app.use(morgan('dev'));
var corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//using cors for react
// app.use(cors());
//Body parser , which allows to receive body data from postman
app.use(express.json());
app.use(
	express.urlencoded({
		urlencoded: true,
		extended: false,
	})
);
app.use(cookieParser());

//File upload
app.use(fileupload());
app.use(cors(corsOptions));

app.use('/customer/auth/', customerRoute);
app.use('/product/', productRoute);
app.use('/vendor/auth/', vendorRoute);
app.use('/', cartRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
module.exports = app;
