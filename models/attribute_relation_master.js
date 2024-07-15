const mongoose = require("mongoose")

const attributeRelationSchema = new mongoose.Schema ({
    attribute_name : {
        type:String,
    },
    product_id : {
        type:String,
    },
    attribute_value:
    {
        type:String,
    },
    
})

const attributeRelation = new mongoose.model("attribute_relation_master", attributeRelationSchema);

module.exports = attributeRelation
