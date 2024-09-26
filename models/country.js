const mongoose = require("mongoose")

const countrySchema = new mongoose.Schema ({

    iso : {
        type:String,
    },
    name : {
        type:String,
    },
    nicename : {
        type:String,
    },
    iso3 : {
        type:String,
    },
    numcode : {
        type:String,
    },
    phonecode : {
        type:String,
    },

})

const country = new mongoose.model("countrys", countrySchema);

module.exports = country