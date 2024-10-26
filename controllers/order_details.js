const order_master = require("../models/order_master");
const user_master_wholesale = require("../models/user_master_wholesale");

const orderDetails = async (req, res) => {

     const id = req.params.id;
    let uid = req.session.UserID;
    let OID = req.session.Order_id;

    if (!uid) {
        uid = req.sessionID;
        const user = user_master_wholesale.findOne({ guest_id: uid });
        if (user) {
            uid = user.user_id;
        }
    }

     const oid = req.query.id

    const orderData = await order_master.findOne({ order_id: oid });
    console.log("orderData",orderData);


    /* if (!oid || !req.session.Order_id) {
        return res.redirect('/');
    } */

    if (orderData) {
        const orderTotalAmount = orderData.order_total;
        uid = orderData.user_id;

        const userData = await user_master_wholesale.findOne({ user_id: uid });
        if (userData) {
            orderData.user_fname = userData.user_fname;
        }
        let voucherName = '';
    }
    res.render("web/views/order_details",{orderData,oid})
}

module.exports = {
    orderDetails,
}