const mongoose = require("mongoose")

const subimageSchema = new mongoose.Schema ({
    product_id : {
        type:String,
        /* require:true, */
    },
    subimage : {
        type:String,

    },
    subimage_date : {
        type:Date,
        default: Date.now,
    },
    subimage_type : {
        type:String,

    },

})

const subimage = new mongoose.model("product_subimage", subimageSchema);

module.exports = subimage