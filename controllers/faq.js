const faq = require("../models/faq.js");

const getfaqInfo = async (req, res) => {
    const faqData = await faq.findOne();
    
    res.render("faq",{faqData})
}

module.exports = {
    getfaqInfo,

}