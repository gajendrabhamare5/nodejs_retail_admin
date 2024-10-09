const mongoose = require("mongoose")

const chargeratingSchema = new mongoose.Schema ({

    shipping_charge : {
        type:String,
    },

    shipping_charge_cart : {
        type:String,
    },

    handling_charge : {
        type:String,

    },

    Datetime : {
        type:Date,
        default: Date.now,

    },


})

const chargeRating = new mongoose.model("charge_ratings", chargeratingSchema);

module.exports = chargeRating