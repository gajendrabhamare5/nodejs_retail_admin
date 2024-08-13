const faq = require("../models/faq.js");

const getfaqInfo = async (req, res) => {
    const faqData = await faq.findOne();
    res.render("web/views/faq", { faqData })
}

const getadminfaq = async (req, res) => {
    const sqldata = await faq.find();
    // console.log(sqldata);
    res.render("retail_admin/views/faq", { sqldata })
}

const addadminfaq = async (req, res) => {
    try {

        const { section_1 } = req.body;
        let faqData = await faq.findOne();

        if (faqData) {
            // Update existing record
            faqData.content = section_1;
            const updateaboutdata = await faqData.save();
            // console.log("updateaboutdata",updateaboutdata);

        } else {

            faqData = new faq({
                content: section_1,
            });
            const savedata = await faqData.save();
        }
        res.send('ok');

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    getfaqInfo,
    getadminfaq,
    addadminfaq,

}