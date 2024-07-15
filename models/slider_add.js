const mongoose = require("mongoose")

const sliderSchema = new mongoose.Schema ({
    url : {
        type:String,

    },
    image : {
        type:String,

    },
})

const slider = new mongoose.model("sliders", sliderSchema);

module.exports = slider