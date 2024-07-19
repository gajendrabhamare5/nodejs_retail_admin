const mongoose = require("mongoose")

const termsRelationSchema = new mongoose.Schema ({
    content : {
        type:String,
    },

    date:
    {
        type:Date,
    },

})

const termsRelation = new mongoose.model("terms_conditions", termsRelationSchema);

module.exports = termsRelation
