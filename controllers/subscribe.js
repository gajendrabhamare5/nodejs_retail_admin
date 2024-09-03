const Subscribe = require("../models/subscribe.js");

const insertsubscribers = async (req, res) => {

    const { subscribe_email } = req.body
    const date = new Date().toISOString().slice(0, 10);

    let subscription = await Subscribe.findOne({ email: subscribe_email });
    if (subscription) {
        const id = subscription._id;

        if (subscription.flag === 0) {
            res.send("exist")
        } else if (subscription.flag === 1) {
            const result = await Subscribe.findByIdAndUpdate(
                id,
                { flag: 0, date: date },
                { new: true }
            );
            if (result) {
                res.send("ok1")
            }

        }

    } else {
        const result = new Subscribe({
            email: subscribe_email,
            date: date,
        })

        const insert = await result.save();

        if (insert) {
            res.send("ok");
        }
    }
}

const getadmin = async (req, res) => {
    const sql_data = await Subscribe.find()
    let num = 0;
    const data_review = [];
    for (const fetch of sql_data) {
        const id = fetch._id
        const email = fetch.email
        let flag = fetch.flag

        if (flag == "0") {
             flag = "Subscribed";
        } else if (flag == "1") {
             flag = "Unsubscribed";
        }

        num++;
        const data1 = {
            checkbox: `<input type="checkbox" id="delete_checkbox" name="delete_checkbox" value="${id}">`,
            no: num,
            email: email,
            flag: flag,
        };

        data_review.push(data1);

    }

    const results = {
        sEcho: 1,
        iTotalRecords: data_review.length,
        iTotalDisplayRecords: data_review.length,
        aaData: data_review,
    };

    res.render("retail_admin/views/subscribers_list", { subscribe_master: data_review });
}

module.exports = {
    insertsubscribers,
    getadmin,
}