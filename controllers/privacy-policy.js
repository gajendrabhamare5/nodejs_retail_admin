const privacy = require("../models/privacy_policy.js");

const getprivacy_policyInfo = async (req, res) => {

    const privacy_data = await privacy.findOne();
    res.render("web/views/privacy_policy",{ privacy_data });

}

const getadminprivacy_policy = async (req,res) => {
    const sqldata = await privacy.find();
    res.render("retail_admin/views/privacy_policy",{sqldata});
}

const addadminprivacy_policy = async (req,res)=>{
    try {

        const { section_1 } = req.body;

        let privacyData = await privacy.findOne();
        if (privacyData) {
            // Update existing record
            privacyData.content = section_1;
            const updateaboutdata = await privacyData.save();

        } else {

            privacyData = new privacy({
                content: section_1,

            });
            const savedata = await privacyData.save();
        }
        res.send('ok');

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}


module.exports = {
    getprivacy_policyInfo,
    getadminprivacy_policy,
    addadminprivacy_policy

}
