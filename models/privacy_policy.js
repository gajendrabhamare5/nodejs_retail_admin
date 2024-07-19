const mongoose = require("mongoose")

const privacyRelationSchema = new mongoose.Schema ({
    content : {
        type:String,
    },
    date:
    {
        type:Date,
    },

});

const privacyRelation = mongoose.model('privacy_policys', privacyRelationSchema);

module.exports = privacyRelation
