const shipping = require("../models/shipping_policy");

const getshipping_policyInfo = async (req, res) => {

const shippingdata = await shipping.findOne();
 //console.log("shipping_policy_data",shippingdata);

    res.render("shipping_policy",{shippingdata})
}

module.exports = {
    getshipping_policyInfo,

}