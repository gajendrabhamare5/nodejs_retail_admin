const mongoose = require("mongoose")

const dealerSchema = new mongoose.Schema ({
    first_name : {
        type:String,
    },
    last_name : {
        type:String,
    },
    phone : {
        type:String,
    },
    whatsapp : {
        type:String,
    },
    email : {
        type:String,
    },
    company : {
        type:String,
    },
    address : {
        type:String,
    },
    vendor_sku : {
        type:String,
    },
    date : {
        type:Date,
        default: Date.now,
    },


})

const dealer = new mongoose.model("dealer_masters", dealerSchema);

module.exports = dealer