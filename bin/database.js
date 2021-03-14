const mongoose = require("mongoose");

const connectDB = async() => {
    const conn = await mongoose.connect(process.env.DATABASE_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });
    function onListening() {
        var addr = conn.connection.host;
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }

    console.log(
        `MongoDB connected to : ${conn.connection.host}`.cyan.underline.bold
    );
};

module.exports = connectDB;
