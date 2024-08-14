const mongoose = require("mongoose")

const codSchema = new mongoose.Schema ({

    id: {
        type:String,
        default: 1,
    },

    minimum_charge : {
        type:String,
    },

    cod_percent : {
        type:String,
    },

    is_apply : {
        type:String,

    },

    show_hide : {
        type:String,

    },

    date:
    {
        type:Date,
        default: Date.now,
    },

})

const cod_charge = new mongoose.model("cod_charge", codSchema);

module.exports = cod_charge