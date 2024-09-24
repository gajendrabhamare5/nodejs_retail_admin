const mongoose = require("mongoose")

const schemeRelationSchema = new mongoose.Schema({


    category_id: {
        type: String,
    },

    subcategory_id: {
        type: String,
    },
    product_id: {
        type: String,
    },

    gift_product_id: {
        type: String,
    },
    cart_limit: {
        type: String,
    },
    scheme_name: {
        type: String,
    },
    buy_qty: {
        type: String,
    },
    free_qty: {
        type: String,
    },
    scheme_delete: {
        type: String,
    },
    type: {
        
        type: String,
    },
    date:
    {
        type: Date,
    },

})

const schemeRelation = new mongoose.model("scheme_master", schemeRelationSchema);

module.exports = schemeRelation
