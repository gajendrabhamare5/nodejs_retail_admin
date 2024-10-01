const mongoose = require("mongoose")

const oredermasterSchema = new mongoose.Schema ({
    user_id : {
        type:String,
    },
    payment_method : {
        type:String,
    },
    shipping_method : {
        type:String,
    },
    address_id : {
        type:String,
    },
    address_type : {
        type:String,
    },
    order_subtotal : {
        type:String,
    },
    order_gst : {
        type:String,
    },
    order_shippingcharge : {
        type:String,
    },
    order_handlingcharge : {
        type:String,
    },
    order_onlinecharge : {
        type:String,
    },
    order_total : {
        type:String,
    },
    coupon_amount : {
        type:String,
    },
    coupon_id : {
        type:String,
    },
    discount_amount : {
        type:String,
    },
    combo_discount : {
        type:String,
    },
    used_wallet_point : {
        type:String,

    }, stitch_amount : {
        type:String,

    }, agent_name : {
        type:String,

    }, remark : {
        type:String,

    }, order_status : {
        type:String,

    },order_invoice : {
        type:String,

    },tracking_code : {
        type:String,

    },carrier_name : {
        type:String,

    },courier_website : {
        type:String,

    },airwaybilno : {
        type:String,

    },courier_id : {
        type:String,

    },dispatch_label_url : {
        type:String,

    },pickup_date : {
        type:String,

    },order_date : {
        type:String,

    },affiliate_user_id : {
        type:String,

    },invoice_date : {
        type:String,

    },txn_id : {
        type:String,

    },paymentStatus : {
        type:String,

    },weight : {
        type:String,

    },walletAmout : {
        type:String,

    },orderType : {
        type:String,

    },pre_booking : {
        type:String,

    },user_type : {
        type:String,

    },user_wallet_point_order : {
        type:String,

    },coupon_point : {
        type:String,

    },order_type : {
        type:String,

    },

})

const order_master = new mongoose.model("order_masters", oredermasterSchema);

module.exports = order_master