const Courier = require("../models/courier.js");
const mongoose = require('mongoose');

const getadmincourier = async (req, res) => {
    const sql_data = await Courier.find()

    let num = 0;
    const data_review = [];
    for (const fetch of sql_data) {
        const id = fetch._id
        const courier_name = fetch.courier_name
        const courier_website = fetch.courier_website

        num++;
        const data1 = {
            id: id,
            checkbox: `<input type="checkbox" id="delete_checkbox" name="delete_checkbox" value="${id}">`,
            no: num,
            courier_name: courier_name,
            courier_website: courier_website,
        };

        data_review.push(data1);

    }

    const results = {
        sEcho: 1,
        iTotalRecords: data_review.length,
        iTotalDisplayRecords: data_review.length,
        aaData: data_review,
    };

    res.render("retail_admin/views/courier_add", { courier_master: data_review });
}

const addadmincourier = async (req, res) => {
    const { courier_name, courier_website } = req.body;
    try {
        const courier = new Courier({

            courier_name: courier_name,
            courier_website: courier_website,

        });

        const savedcourier = await courier.save();
        // console.log("savedcourier=", savedcourier);

        res.send('ok');
    } catch (err) {
        console.error('Data Inserted failed:', err);
        res.status(500).send({ status: 'error', message: 'Data inserted failed.' });
    }


}

const deleteadmincourier = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.send('error')
    } else {
        const result = await Courier.deleteOne({ _id: id });
        res.send('ok');
    }
}

const courierEditInfo = async (req, res) => {
    const id = req.params.id;
    if (mongoose.Types.ObjectId.isValid(id)) {
        const categoryObjectId = new mongoose.Types.ObjectId(id)
        const sql_data = await Courier.find({ _id: categoryObjectId })
        res.render("retail_admin/views/courier_edit", { sql_data })
    }
}

const updatecourierEdit = async (req, res) => {


    const { courier_id, courier_name, courier_website } = req.body;
   
    await Courier.updateOne(
        { _id: courier_id },
        { $set: { courier_name: courier_name, courier_website: courier_website } }
    );
    res.send('ok');

}



module.exports = {
    getadmincourier,
    addadmincourier,
    deleteadmincourier,
    courierEditInfo,
    updatecourierEdit
}