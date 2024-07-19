const mongoose = require("mongoose")

const exchangeRelationSchema = new mongoose.Schema ({
    content : {
        type:String,
    },
    date:
    {
        type:Date,
    },

})

const exchangeRelation = new mongoose.model("refund_policies", exchangeRelationSchema);

module.exports = exchangeRelation
