const mongoose = require("mongoose")

const inquirySchema = new mongoose.Schema ({
    content : {
        type:String,
    },

})

const inquiry = new mongoose.model("marquee", inquirySchema);

module.exports = inquiry