const express = require("express");

const morgan = require("morgan")
const fileupload = require("express-fileupload");
const connectDB = require("./bin/database");
const cookieParser = require("cookie-parser");
const path = require("path");
const colors = require("colors");
const errorHandler = require("./middleware/customizederror");
const dotenv = require("dotenv");

dotenv.config({
    path: "./bin/config.env",
});


// Connect to mongoDB database
connectDB();

// Load routes files
const customerRoute = require("./routes/customerRouter");
const productRoute =require("./routes/productRouter")
const cors = require("cors");
const {
    urlencoded
} = require("express");

// initialize out app variable with express
const app = express();

//logger
app.use(morgan("dev"));
//using cors for react
app.use(cors());
//Body parser , which allows to receive body data from postman
app.use(express.json());
app.use(express.urlencoded({
    urlencoded: true,
    extended: false
}))
app.use(cookieParser());

//File upload
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routes
app.use("/customer/auth/", customerRoute);
app.use("/product/",productRoute);
// To use the custom error message
app.use(errorHandler);

module.exports = app;
