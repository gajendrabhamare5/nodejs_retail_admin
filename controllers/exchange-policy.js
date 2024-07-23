const exchange = require("../models/exchangePolicy.js")

const getexchange_policyInfo = async (req, res) => {

    const exchangeData = await exchange.findOne();
    //console.log("exchangeData",exchangeData);

    res.render("web/views/exchange_policy", { exchangeData });
}

module.exports = {
    getexchange_policyInfo,

}