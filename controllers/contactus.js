const contactus = require("../models/contactinq");

const getcontactusInfo = async (req, res) => {
    res.render("web/views/contactus")
}

const insertcontactusInfo = async (req,res) => {

    const { inq_name, inq_email, inq_phone, inq_msg } = req.body;

     if (!inq_name) {
        return res.json({
            status: "ok",
            message: "Enter Name",
            flag: "0"
        });
    }
    if (!inq_email) {
        return res.json({
            status: "ok",
            message: "Enter email Id",
            flag: "0"
        });
    }

    if (!inq_phone) {
        return res.json({
            status: "ok",
            message: "Enter Phone Number",
            flag: "0"
        });
    }
    if (inq_phone.length !== 10) {
        return res.json({
            status: "ok",
            message: "Phone number must be 10 digits",
            flag: "0"
        });
    }

    const inquiry = new contactus({
        name: inq_name,
        email: inq_email,
        mobilno: inq_phone,
        message: inq_msg,
    });

    await inquiry.save();

    res.json({
        status: "ok",
        message: "Inquiry Added..",
        flag: "1"
    });
}

module.exports = {
    getcontactusInfo,
    insertcontactusInfo,

}