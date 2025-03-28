const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const mongoose = require('mongoose');

const users_data = require("../models/user_master_wholesale");
/* const order_data = require("../models/order_master.js"); */

const getadminuserlist = async (req, res) => {

    res.render("retail_admin/views/users_list");
}

const getadminuserslist = async (req,res) => {
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
                    { Phone: new RegExp(searchValue, "i") }
                ]
            };
        }

        let totalData = await users_data.countDocuments(searchQuery);
        let users = await users_data.find(searchQuery)
            .sort({ Date: -1 })
            .skip(start)
            .limit(length === -1 ? totalData : length);

        let data = await Promise.all(users.map(async (user) => {
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
        }));

        res.json({
            draw: draw,
            recordsTotal: totalData,
            recordsFiltered: totalData,
            data: data
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const userEditInfo = async (req,res) => {
    res.render("retail_admin/views/user_edit");

}

module.exports = {
    getadminuserlist,
    getadminuserslist,
    userEditInfo,
}