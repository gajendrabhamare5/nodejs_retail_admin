const Dealer = require('../models/dealer.js');
const mongoose = require('mongoose');

const getdealer = async (req, res) => {
    const sql_data = await Dealer.find()

    let num = 0;
    const data_review = [];
    for (const fetch of sql_data) {
        const id = fetch._id
        const first_name = fetch.first_name
        const last_name = fetch.last_name
        const phone = fetch.phone

        const vendor_sku = fetch.vendor_sku


        num++;
        const data1 = {

            checkbox: `<input type="checkbox" id="delete_checkbox" name="delete_checkbox" value="${id}">`,
            no: num,
            first_name: `${first_name} ${last_name}`,
            phone: phone,
            vendor_sku: vendor_sku,
        };

        data_review.push(data1);

    }

    const results = {
        sEcho: 1,
        iTotalRecords: data_review.length,
        iTotalDisplayRecords: data_review.length,
        aaData: data_review,
    };

    res.render("retail_admin/views/dealer_add",{dealer_master: data_review});
}

const adddealer = async(req,res)=>{
    const { first_name, last_name, phone, whatsapp, email, company, address, vendor_sku } = req.body;

    const existingDealer = await Dealer.findOne({ vendor_sku });
   /*  console.log("existingDealer",existingDealer); */


    if (existingDealer) {
        return res.send('vendorsku_error');
    }

    try {
        const newDealer = new Dealer({
            first_name,
            last_name,
            phone,
            whatsapp,
            email,
            company_name: company,
            address,
            vendor_sku,

        });

       const adddealer =  await newDealer.save();
        res.send("ok");
    } catch (error) {
        console.error('Data Inserted failed:', err);
        res.status(500).send({ status: 'error', message: 'Data inserted failed.' });
    }



}

const deletedealer = async(req,res)=>{
    const id = req.params.id;
    /* console.log("ids",id); */
    const ids = id.split(',').map(id => new mongoose.Types.ObjectId(id));

    if (ids.length === 0 || !ids.every(mongoose.Types.ObjectId.isValid)) {
        return res.status(400).send('Invalid or missing ID(s)');
    }

    if (!id) {
        res.send('error')
    } else {
        const result = await Dealer.deleteMany({ _id: { $in: ids } });
        res.send('ok');
    }
}

module.exports= {
    adddealer,
    getdealer,
    deletedealer,
}
