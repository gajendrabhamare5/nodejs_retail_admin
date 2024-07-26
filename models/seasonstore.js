const mongoose = require("mongoose")

const seasonstoreRelationSchema = new mongoose.Schema({


    url: {
        type: String,
    },

    title: {
        type: String,
    },
    customer_review: {
        type: String,
    },

    slider_image: {
        type: String,
    },
    date:
    {
        type: Date,
    },

})

const seasonstoreRelation = new mongoose.model("season_store", seasonstoreRelationSchema);

module.exports = seasonstoreRelation
