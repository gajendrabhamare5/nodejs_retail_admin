const mongoose = require("mongoose")

const sizeSchema = new mongoose.Schema ({
    size_name : {
        type:String,
    },
    size_hide : {
        type:String,
    },
    sort : {
        type:String,
    },
    date : {
        type:String,
    },

})

const size = new mongoose.model("size_masters", sizeSchema);

module.exports = size