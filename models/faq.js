const mongoose = require("mongoose")

const faqRelationSchema = new mongoose.Schema ({
    content : {
        type:String,
    },
    date:
    {
        type:Date,
    },

})

const faqRelation = new mongoose.model("faqs", faqRelationSchema);

module.exports = faqRelation
