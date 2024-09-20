const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema ({
    UserID : {
        type:String,
    },
    ProID : {
        type:String,
    },
    cartid:
    {
        type:String,
    },
    free_item :
    {
        type:String,
    },
    title:
    {
        type:String,
    },
    Qty:
    {
        type:String,
    },
    Size:
    {
        type:String,
    },
    Stitch:
    {
        type:String,
    },
    extra_price:
    {
        type:String,
    },
    extra_name:
    {
        type:String,
    },
    total_extra_price:
    {
        type:String,
    },
    cartType:
    {
        type:String,
    },
    offer_applied:
    {
        type:String,
    },
     offer_applied_id:
    {
        type:String,
    },
    DateTime:
    {
        type:Date,
        default: Date.now,
    },

})

const card = new mongoose.model("cart_masters", cartSchema);
module.exports = card