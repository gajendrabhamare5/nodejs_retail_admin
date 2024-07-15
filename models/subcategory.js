const mongoose = require("mongoose")

const subcategorySchema = new mongoose.Schema ({
    category_id : {
        type:String,
        /* require:true, */
    },
    subcategory_name : {
        type:String,

    },
    subcategory_seo_url : {
        type:String,
    },
    subcategory_image : {
        type:String,

    },
    subcategory_meta_title : {
        type:String,

    },
    subcategory_meta_keyword : {
        type:String,

    },
    subcategory_meta_description:
    {
        type:String,
    },
    other_details:
    {
        type:String,
    },
    subcategory_delete:
    {
        type:Number,
    },

    subcategory_hide:
    {
        type:String,
    },
    date:
    {
        type:Date,
        default: Date.now,
    },

})

const subcategory = new mongoose.model("subcategory_masters", subcategorySchema);

module.exports = subcategory