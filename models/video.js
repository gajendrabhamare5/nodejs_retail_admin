const mongoose = require("mongoose")

const videoRelationSchema = new mongoose.Schema({
    category_name : {
        type:String,
       
    },
    category_seo_url : {
        type:String,

    },
    category_image : {
        type:String,
    },
    views : {
        type:String,

    },
    price : {
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

const videoRelation = new mongoose.model("video", videoRelationSchema);

module.exports = videoRelation
