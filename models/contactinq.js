const mongoose = require("mongoose")

const contactinqSchema = new mongoose.Schema ({
    name : {
        type:String,

    },
    email : {
        type:String,

    },
    mobilno:
    {
        type:String,
    },

message:
    {
        type:String,
    },
    date:
    {
        type:Date,

    },

})

const contactinq = new mongoose.model("contactinfo", contactinqSchema);

module.exports = contactinq