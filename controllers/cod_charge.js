const codcharge = require("../models/codcharge");

const getadmincodcharge = async (req, res) => {
    let codchargedata = await codcharge.find();
    // console.log("codchargedata",codchargedata);
    
    res.render("retail_admin/views/update_cod_charge", {codchargedata});
}


const addadmincodcharge = async (req,res)=>{
        const { minimum_charge,cod_percent,is_apply} = req.body

        let is_apply_val = 0;
        if (is_apply === 'true' || is_apply === true) {
            is_apply_val = 1;
        } else if (is_apply === 'false' || is_apply === false) {
            is_apply_val = 0;
        }

        try {

            let codchargedata = await codcharge.findOne();

        if (codchargedata) {
            // Update existing record
            codchargedata.minimum_charge = minimum_charge;
            codchargedata.cod_percent = cod_percent;
            codchargedata.is_apply = is_apply_val;

            const updatecodcharge = await codchargedata.save();

            res.json({ status: 'ok', msg: 'Successfully updated' });
        }else{

            res.json({ status: 'error', msg: 'Update failed or no changes' });
        }

        } catch (err) {
            res.json({ status: 'error', msg: err.message });
        }
}

module.exports = {
    getadmincodcharge,
    addadmincodcharge,
}