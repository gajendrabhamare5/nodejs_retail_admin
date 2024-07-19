const mongoose = require("mongoose")

const privacyRelationSchema = new mongoose.Schema ({
    content : {
        type:String,
    },
    date:
    {
        type:Date,
    },

})

const privacyRelation = new mongoose.model("privacy_policy", privacyRelationSchema);

module.exports = privacyRelation
