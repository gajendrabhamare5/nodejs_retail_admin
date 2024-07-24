const mongoose = require("mongoose")

const subscribeRelationSchema = new mongoose.Schema ({

email : {
        type:String,
    },

    date:
    {
        type:Date,
    },

flag:
    {
        type:Number,
        default:1,
    },

})

const subscribeRelation = new mongoose.model("subscribes", subscribeRelationSchema);

module.exports = subscribeRelation
