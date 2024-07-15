const mongoose = require("mongoose")

const cnumberSchema = new mongoose.Schema ({
    line_1 : {
        type:String,

    },
    line_2 : {
        type:String,

    },
    line_3:
    {
        type:String,
    },
    line_4:
    {
        type:String,
    },
    line_5:
    {
        type:String,

    },

})

const cnumber = new mongoose.model("contact_numbers", cnumberSchema);

module.exports = cnumber