const mongoose = require("mongoose")

const orderproductmasterSchema = new mongoose.Schema ({
    order_id : {
        type:String,
    },
    product_id:
    {
        type:String,
    },
    product_qty:
    {
        type:String,
    },
     product_price:
    {
        type:String,
    },
     product_gst:
    {
        type:String,
    },
    product_weight:
    {
        type:String,
    },
    product_discount:
    {
        type:String,
    },
    extra_stitch_id:
    {
        type:String,
    }, subimage_id:
    {
        type:String,
    },
    applied_offer_id:
    {
        type:String,
    },
    is_free:
    {
        type:String,
    },

});

const orderproductmasterRelation = mongoose.model('order_product_masters', orderproductmasterSchema);

module.exports = orderproductmasterRelation
