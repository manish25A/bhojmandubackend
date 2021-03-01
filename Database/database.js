const mongoose = require('mongoose');

const connectDB=async()=>{
    const connection=mongoose.connect('mongodb://127.0.0.1:27017/BhojMandu', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
});
console.log(
    `MongoDB connected to : ${conn.connection.host}`.cyan.underline.bold
  );
};
  module.exports = connectDB;
