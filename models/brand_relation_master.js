const mongoose = require("mongoose")

const brandRelationSchema = new mongoose.Schema ({
    brand_id : {
        type:String,

    },
    product_id : {
        type:String,
    },
    brand_type:
    {
        type:String,
    },
    date:
    {
        type:Date,
        default: Date.now,
    },

})

const brandRelation = new mongoose.model("brand_relation_master", brandRelationSchema);

module.exports = brandRelation