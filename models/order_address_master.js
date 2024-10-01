const mongoose = require("mongoose")

const orederaddressSchema = new mongoose.Schema ({
    user_id : {
        type:String,
    },
    first_name : {
        type:String,
    },
    last_name : {
        type:String,
    },
    address : {
        type:String,
    },
    address2 : {
        type:String,
    },
     country : {
        type:String,
    },
    state : {
        type:String,
    },
    city : {
        type:String,
    },
    pincode : {
        type:String,
    },
    phone_no : {
        type:String,
    },
    whatsapp_no : {
        type:String,
    },
    email_id : {
        type:String,
    },
    company_name : {
        type:String,
    },
    gst_no : {
        type:String,
    },
    type : {
        type:String,
    },
     address_delete : {
        type:String,
        default:0,
    },

})

const order_address = new mongoose.model("order_address_masters", orederaddressSchema);

module.exports = order_address