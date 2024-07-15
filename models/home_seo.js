const mongoose = require("mongoose")

const seoSchema = new mongoose.Schema ({
    content : {
        type:String,

    },
    tital : {
        type:String,

    },
    keyword:
    {
        type:String,
    },
    description:
    {
        type:String,
    },
    date:
    {
        type:Date,
        default: Date.now,
    },

})

const seo = new mongoose.model("home_seos", seoSchema);

module.exports = seo