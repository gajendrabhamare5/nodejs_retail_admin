const mongoose = require("mongoose")

const attributeSchema = new mongoose.Schema ({
    attribute_name : {
        type:String,
    },
    attribute_metakey : {
        type:String,
    },
    attribute_metatitle:
    {
        type:String,
    },
    attribute_metadesc:
    {
        type:String,
    },
    attribute_delete:
    {
        type:String,
    },
    filter:
    {
        type:String,
    },
    attribute_hide:
    {
        type:String,
    },

})

const attribute = new mongoose.model("attribute_master", attributeSchema);

module.exports = attribute
