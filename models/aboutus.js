const mongoose = require("mongoose")

const aboutusRelationSchema = new mongoose.Schema ({
    image : {
        type:String,
    },

    section_1 : {
        type:String,
    },

    section_2:
    {
        type:String,
    },

    section_4:
    {
        type:String,
    },

    section_5:
    {
        type:String,
    },
    section_6:
    {
        type:String,
    },
     section_7:
    {
        type:String,
    },
    section_8:
    {
        type:String,
    },
    date:
    {
        type:Date,
    },

})

const aboutusRelation = new mongoose.model("about_us", aboutusRelationSchema);

module.exports = aboutusRelation
