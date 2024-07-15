const mongoose = require("mongoose")

const relationMasterSchema = new mongoose.Schema ({
    product_id : {
        type:String,
        /* require:true, */
    },
    type_id : {
        type:String,

    },
    type : {
        type:String,
    },

})

const relationMaster = new mongoose.model("relation_master", relationMasterSchema);

module.exports = relationMaster