const mongoose = require("mongoose")

const shippingRelationSchema = new mongoose.Schema({
    content : {
        type:String,
    },
    date:
    {
        type:Date,
    },
})

const shippingRelation = new mongoose.model("shipping_policies", shippingRelationSchema);

module.exports = shippingRelation
