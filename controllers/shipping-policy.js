const shipping = require("../models/shipping_policy");

const getshipping_policyInfo = async (req, res) => {

const shippingdata = await shipping.findOne();
 //console.log("shipping_policy_data",shippingdata);

    res.render("web/views/shipping_policy",{shippingdata})
}

const getadminshipping_policy = async (req,res) =>{
    const sqldata = await shipping.find();
    res.render("retail_admin/views/shipping_policy",{sqldata})
}

const addadminshipping_policy = async (req,res) => {
    try {

        const { section_1 } = req.body;

        let shippingData = await shipping.findOne();
        if (shippingData) {
            // Update existing record
            shippingData.content = section_1;
            const updateaboutdata = await shippingData.save();

        } else {

            shippingData = new shipping({
                content: section_1,

            });
            const savedata = await shippingData.save();
        }
        res.send('ok');

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}


module.exports = {
    getshipping_policyInfo,
    getadminshipping_policy,
    addadminshipping_policy,
}