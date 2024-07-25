const mongoose = require("mongoose")

const announcementRelationSchema = new mongoose.Schema ({
    title : {
        type:String,
    },

    url : {
        type:String,
    },

})

const announcementRelation = new mongoose.model("announcements", announcementRelationSchema);

module.exports = announcementRelation
