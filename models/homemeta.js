const mongoose = require("mongoose")

const homemetaSchema = new mongoose.Schema ({
    meta_title : {
        type:String,

    },
    meta_keyword : {
        type:String,

    },
    section_1: {
        type:String,
    },
    
    date:
    {
        type:Date,
        default: Date.now,
    },

})

const homemeta = new mongoose.model("home_page_meta_details", homemetaSchema);

module.exports = homemeta