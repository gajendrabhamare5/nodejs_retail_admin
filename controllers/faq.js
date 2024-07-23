const faq = require("../models/faq.js");

const getfaqInfo = async (req, res) => {
    const faqData = await faq.findOne();
    
    res.render("web/views/faq",{faqData})
}

module.exports = {
    getfaqInfo,

}