const mongoose = require("mongoose")

const brandSchema = new mongoose.Schema ({
    brand_name : {
        type:String,

    },
    brand_image : {
        type:String,
    },
    brand_seo_url:
    {
        type:String,
    },
    brand_meta_title:
    {
        type:String,
    },
    brand_meta_keyword:
    {
        type:String,
    },
    brand_meta_description:
    {
        type:String,
    },
    brand_description:
    {
        type:String,
    },
    brand_hide:
    {
        type:String,
    },
    top_brands:
    {
        type:String,
    },
    date:
    {
        type:Date,
        default: Date.now,
    },

})

const brand = new mongoose.model("brand_master", brandSchema);

module.exports = brand