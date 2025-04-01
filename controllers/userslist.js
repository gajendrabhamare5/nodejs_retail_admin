const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const mongoose = require("mongoose");
const express = require("express");

const users_data = require("../models/user_master_wholesale");
const Address = require("../models/address_master");
/* const order_data = require("../models/order_master.js"); */

const getadminuserlist = async (req, res) => {
  res.render("retail_admin/views/users_list");
};

const getadminuserslist = async (req, res) => {
  try {
    let draw = parseInt(req.query.draw) || 1;
    let start = parseInt(req.query.start) || 0;
    let length = parseInt(req.query.length) || 10;
    let searchValue = req.query.search?.value || "";

    let searchQuery = {};
    if (searchValue) {
      searchQuery = {
        $or: [
          { user_fname: new RegExp(searchValue, "i") },
          { Email: new RegExp(searchValue, "i") },
          { Whatsno: new RegExp(searchValue, "i") },
          { Phone: new RegExp(searchValue, "i") },
        ],
      };
    }

    let totalData = await users_data.countDocuments(searchQuery);
    let users = await users_data
      .find(searchQuery)
      .sort({ Date: -1 })
      .skip(start)
      .limit(length === -1 ? totalData : length);

    let data = await Promise.all(
      users.map(async (user) => {
        let user_id = user._id;
        let name = `${user.user_fname}`;
        let email = user.Email;
        let phone = `${user.Country_code || ""} ${user.Phone}`;
        let whatsapp = `${user.Country_code1 || ""} ${user.Whatsno || ""}`;
        let pincode = user.pincode;
        let state = user.state;
        let city = user.city;
        let date = new Date(user.Date).toLocaleDateString("en-GB");

        /*  let orderSummary = await Order.aggregate([
                { $match: { user_id: mongoose.Types.ObjectId(user_id) } },
                {
                    $group: {
                        _id: "$user_id",
                        sum_total: { $sum: "$order_total" },
                        sum_discount: { $sum: "$discount_amount" }
                    }
                }
            ]);

            let total = orderSummary.length > 0 ? orderSummary[0].sum_total - orderSummary[0].sum_discount : 0; */
        let total = 100;

        return [
          `<input type="checkbox" id="delete_checkbox" name="delete_checkbox" value="${user_id}">`,
          `<a href="user_edit/${user_id}">${user_id}</a>`,
          `<a href="user_edit/${user_id}">${email}</a>`,
          name,
          phone,
          whatsapp,
          total,
          pincode,
          state,
          city,
          date,
        ];
      })
    );

    res.json({
      draw: draw,
      recordsTotal: totalData,
      recordsFiltered: totalData,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userEditInfo = async (req, res) => {
  const id1 = req.params.id;
  const sql_user = await users_data.findOne({ _id: id1 });
 /*  console.log("sql_product",sql_user); */

  res.render("retail_admin/views/user_edit",{ sql_user });
};

const userUpdateInfo = async (req,res) => {
    const {
        user_id,
        fname,
        lname,
        company_name,
        get_country_code,
        user_type,
        phone,
        get_country_code1,
        whatsapp,
        pincode,
        state,
        city,
        cust_address,
        cust_email,
        gst_number
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    const updatedUser = await users_data.findOneAndUpdate(
        { _id: user_id },
        {
            user_fname: fname,
            user_lname: lname,
            user_type,
            Company_name: company_name,
            Country_code1: get_country_code1,
            pincode,
            state,
            city,
            Whatsno: whatsapp,
            bill_to: cust_address,
            gstNumber: gst_number,
            Email: cust_email
        },
        { new: true }
    );

    if (updatedUser) {
        res.send('ok');
    } else {
        res.status(404).json({ message: 'User not found' });
    }



}

module.exports = {
  getadminuserlist,
  getadminuserslist,
  userEditInfo,
  userUpdateInfo,
};
