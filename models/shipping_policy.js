const mongoose = require("mongoose")
console.log("Model call");
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
