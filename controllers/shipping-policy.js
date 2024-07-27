const shipping = require("../models/shipping_policy");

const getshipping_policyInfo = async (req, res) => {

const shippingdata = await shipping.findOne();
 //console.log("shipping_policy_data",shippingdata);

    res.render("web/views/shipping_policy",{shippingdata})
}

const getadminshipping_policy = async (req,res) =>{
    res.render("retail_admin/views/shipping_policy")
}

module.exports = {
    getshipping_policyInfo,
    getadminshipping_policy,
}