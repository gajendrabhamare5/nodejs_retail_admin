const mongoose = require("mongoose")

const couponSchema = new mongoose.Schema ({
    coupon_name : {
        type:String,

    },
    rupees : {
        type:String,

    },
    percentage : {
        type:String,
    },
    category_id : {
        type:String,

    },
    user_id : {
        type:String,

    },
    subcategory_id : {
        type:String,

    },
    brand_id:
    {
        type:String,
    },
    cart_limit:
    {
        type:String,
    },
    remark:
    {
        type:String,
    },
    expiry_date:
    {
        type:String,
    },

limitation:
    {
        type:String,
    },
    monthly:
    {

        type:String,
        default: '0',
    },
    visible:
    {
        type:String,
        default: '0',
    },

})

const coupon = new mongoose.model("coupon_master", couponSchema);

module.exports = coupon