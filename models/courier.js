const mongoose = require("mongoose")

const courierSchema = new mongoose.Schema ({
    courier_name : {
        type:String,
    },
    courier_website : {
        type:String,
    },

})

const courier = new mongoose.model("courier_master", courierSchema);

module.exports = courier