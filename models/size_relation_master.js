const mongoose = require("mongoose")

const sizeRelationSchema = new mongoose.Schema ({
    size_id : {
        type:String,
    },
    catalog_id : {
        type:String,
    },
    product_id : {
        type:String,
    },
    product_sku : {
        type:String,
    },
    product_price : {
        type:String,
    },
    size_qty : {
        type:String,
    },
    size_type : {
        type:String,
    },
    date : {
        type:Date,
        default: Date.now,
    },

})

const sizeRelation = new mongoose.model("size_relation_master", sizeRelationSchema);

module.exports = sizeRelation