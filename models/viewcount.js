const mongoose = require("mongoose")

const viewRelationSchema = new mongoose.Schema({
    ip_address : {
        type:String,

    },
    page_name : {
        type:String,

    },
    date:
    {
        type:Date,
        default: Date.now,
    },
})

const viewRelation = new mongoose.model("view_count", viewRelationSchema);

module.exports = viewRelation
