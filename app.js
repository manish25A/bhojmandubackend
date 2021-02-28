var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser=require('body-parser')
var logger = require('morgan');
var cors=require('cors');
// importing db
var db = require('./Database/database')

//importing router
var indexRouter = require('./routes/index');
var customerRouter = require('./routes/Customer')
var productRouter = require('./routes/productRoute')
//using
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//using router
app.use(indexRouter);
app.use(customerRouter);
app.use(productRouter);

module.exports = app;
