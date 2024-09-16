const usermasterwholesale = require("../models/user_master_wholesale.js");

const getemail = async (req, res) => {
    //const faqData = await faq.findOne();

    try {
        const email = req.body.Email;
        const phone = req.body.Phone;

       // const userCollection = db.collection('user_master_wholesale');

        const emailCount = await usermasterwholesale.find({ Email: email });
        const phoneCount = await usermasterwholesale.find({ Phone: phone });


        let response;
        if (emailCount.length) {
            response = {
                status: "ok",
                type: "email",
                message: "Email Id already exists.",
                flag: "0"
            };
        } else if (phoneCount.length) {
            response = {
                status: "ok",
                type: "phone",
                message: "Phone number already exists.",
                flag: "0"
            };
        } else {
            response = {
                status: "ok",
                flag: "1"
            };
        }

        // Send response
        res.json(response);

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }

   // res.render("web/views/check_email_id")
}

module.exports= {
    getemail,
}