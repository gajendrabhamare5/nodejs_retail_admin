const terms = require("../models/terms_condition.js");

const getterms_conditionInfo = async (req, res) => {
    const termsData = await terms.findOne();
    //console.log("terms_condition",terms_condition);
    res.render("web/views/terms_condition",{termsData})
}

module.exports = {
    getterms_conditionInfo,

}