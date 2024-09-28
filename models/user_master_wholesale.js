const mongoose = require("mongoose")

const usermasterRelationSchema = new mongoose.Schema ({
    guest_id : {
        type:String,
    },
    user_type : {
        type:String,
    },
    user_fname : {
        type:String,
    },
    Email : {
        type:String,
    },
    Phone : {
        type:String,
    },
    Password : {
        type:String,
    },
    send_key : {
        type:String,
    },
    Date : {
        type:Date,
    },
    isActive : {
        type:String,
        default:0,
    },
    bill_to : {
        type:String,
    },
    isShow : {
        type:String,
        default:0,
    },
    flag : {
        type:String,
        default:0,
    },
    is_affiliate : {
        type:String,
        default:0,
    },
    referral_code : {
        type:String,
    },
    referred_user_id : {
        type:String,
        default:0,
    },
    user_wallet_point : {
        type:String,
        default:0,
    },
     wallet_amt : {
        type:String,
        default:0,
    },
    review_points: {
        type:String,
        default:0,
    },
    referred_pending_amt : {
        type:String,
        default:0,
    },
     membership : {
        type:String,

    },
    membership_status : {
        type:String,
        default:0,
    },
    login_key : {
        type:String,
    },

})

const usermasterRelation = new mongoose.model("user_master_wholesales", usermasterRelationSchema);

module.exports = usermasterRelation
