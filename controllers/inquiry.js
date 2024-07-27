const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const inquiry = require("../models/contactinq.js")

const getinquiryinfo = async (req,res)=>{

    const inqData = await inquiry.find().sort({ _id: -1 });
    let num = 0;

    const data_product = [];

    for (const fetch of inqData) {
        const id = fetch._id;
        const name = fetch.name;
        const email = fetch.email;
        const mobilno = fetch.mobilno;
        const message = fetch.message;
        const date1 = fetch.date;

        let dateOnly;
      if (date1) {
        try {

          dateOnly = new Date(date1).toISOString().slice(0, 10);
        } catch (error) {

          console.error(`Error formatting date for record ${id}:`, error);
          dateOnly = 'Invalid Date';
        }
      } else {
        dateOnly = '';
      }

    num++;

    const data1 = {
        id: id,
        name: name,
        email: email,
        mobilno: mobilno,
        message: message,
        date: dateOnly,
    }

    data_product.push(data1);

    }
    const results = {
        sEcho: 1,
        iTotalRecords: data_product.length,
        iTotalDisplayRecords: data_product.length,
        aaData: data_product,
    };

        res.render("retail_admin/views/inquiry_list",{ view_inquiry: data_product });
}

const deleteinquiry = async (req,res) => {
    try {
        const inqid = req.params.id;
        console.log("inqid",inqid);
        const result = await inquiry.findByIdAndDelete(inqid);

        if (!result) {
            return res.status(404).json({ error: 'Inquiry is not found' });
        }

        res.send("ok")

    } catch (error) {
        console.log(error);
        res.status(500).send("error")
    }

}

module.exports = {
    getinquiryinfo,
    deleteinquiry,

};
