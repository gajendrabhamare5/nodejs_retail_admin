const privacy = require("../models/privacy_policy.js");

const getprivacy_policyInfo = async (req, res) => {

    const privacy_data = await privacy.findOne();

    

    res.render("privacy_policy",{ privacy_data });

}

module.exports = {
    getprivacy_policyInfo,

}
