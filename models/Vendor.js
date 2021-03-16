const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const vendorSchema = new Schema(
    {
        vendor_id: Number,
        name: String,
        logo: String,
        desc: String,
        vendor_name: String
    },
);

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
