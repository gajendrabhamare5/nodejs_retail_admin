const terms = require("../models/terms_condition.js");

const getterms_conditionInfo = async (req, res) => {
    const termsData = await terms.findOne();
    //console.log("terms_condition",terms_condition);
    res.render("web/views/terms_condition",{termsData})
}

const getadminterms = async (req,res) => {
    const sqldata = await terms.find();
    res.render("retail_admin/views/terms",{sqldata})
}

const addadminterms = async (req,res) => {
    try {

        const { section_1 } = req.body;

        let termsData = await terms.findOne();
        if (termsData) {
            // Update existing record
            termsData.content = section_1;
            const updateaboutdata = await termsData.save();

        } else {

            termsData = new terms({
                content: section_1,

            });
            const savedata = await termsData.save();
        }
        res.send('ok');

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    getterms_conditionInfo,
    getadminterms,
    addadminterms,

}