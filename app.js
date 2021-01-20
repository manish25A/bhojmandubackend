var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// importing db
var db = require('./Database/database')

//importing router
var indexRouter = require('./routes/index');
var customerRouter = require('./routes/Customer')
//using
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//using router
app.use(indexRouter);
app.use(customerRouter)

module.exports = app;
