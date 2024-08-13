const exchange = require("../models/exchangePolicy.js")

const getexchange_policyInfo = async (req, res) => {

    const exchangeData = await exchange.findOne();
    //console.log("exchangeData",exchangeData);

    res.render("web/views/exchange_policy", { exchangeData });
}

const getadminrefund = async (req,res)=>{

    const sqldata = await exchange.find();
    res.render("retail_admin/views/refund_policy", { sqldata })

}

const addadminrefund = async (req,res)=>{
 try {

        const { section_1 } = req.body;
        let exchangeData = await exchange.findOne();

        if (exchangeData) {
            // Update existing record
            exchangeData.content = section_1;
            const updateaboutdata = await exchangeData.save();
            // console.log("updateaboutdata",updateaboutdata);

        } else {

            exchangeData = new faq({
                content: section_1,
            });
            const savedata = await exchangeData.save();
        }
        res.send('ok');

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    getexchange_policyInfo,
    getadminrefund,
    addadminrefund,

}