const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema ({
    category_name : {
        type:String,
        /* require:true, */
    },
    category_seo_url : {
        type:String,

    },
    category_image : {
        type:String,
    },
    category_banner : {
        type:String,

    },
    category_meta_title : {
        type:String,

    },
    category_meta_keyword : {
        type:String,

    },
    category_meta_description:
    {
        type:String,
    },
    other_details:
    {
        type:String,
    },
    category_sort:
    {
        type:Number,
    },
    cat_mobile:
    {
        type:String,
    },
    category_delete:
    {
        type:String,
    },
    category_hide:
    {
        type:String,
    },
    date:
    {
        type:Date,
        default: Date.now,
    },

})

const category = new mongoose.model("category_master", categorySchema);

module.exports = category