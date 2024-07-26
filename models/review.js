const mongoose = require("mongoose")

const reviewRelationSchema = new mongoose.Schema({


    product_id: {
        type: String,
    },

    customer_name: {
        type: String,
    },
    customer_review: {
        type: String,
    },

    star: {
        type: Number,
    },

    customer_image: {
        type: String,
    },


    Datetime:
    {
        type: Date,
    },

})

const reviewRelation = new mongoose.model("review_rating", reviewRelationSchema);

module.exports = reviewRelation
