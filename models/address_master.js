const mongoose = require("mongoose")

const addressmasterRelationSchema = new mongoose.Schema ({

    user_id : {
        type:String,
    },
    guest_id : {
        type:String,
    },
    first_name : {
        type:String,
    },
    address : {
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
    Date : {
        type:Date,
    },
    pincode : {
        type:String,

    },
    phone_no : {
        type:String,
    },
    email_id : {
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

const addressmasterRelation = new mongoose.model("address_masters", addressmasterRelationSchema);
module.exports = addressmasterRelation
