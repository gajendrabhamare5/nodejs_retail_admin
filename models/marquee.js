const mongoose = require("mongoose")

const marqueeSchema = new mongoose.Schema ({
    content : {
        type:String,
    },

})

const marquee = new mongoose.model("marquee", marqueeSchema);

module.exports = marquee