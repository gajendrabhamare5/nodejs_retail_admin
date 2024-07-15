const mongoose = require("mongoose")

const subattributeSchema = new mongoose.Schema ({
    attribute_id : {
        type:String,
    },
    sub_attribute_name : {
        type:String,
    },
    sub_attribute_metatitle:
    {
        type:String,
    },
    sub_attribute_metakey:
    {
        type:String,
    },
    sub_attribute_metadesc:
    {
        type:String,
    },
    sub_attribute_delete:
    {
        type:String,
    },
    sub_attribute_hide:
    {
        type:String,
    },

})

const subattribute = new mongoose.model("sub_attribute_master", subattributeSchema);

module.exports = subattribute
