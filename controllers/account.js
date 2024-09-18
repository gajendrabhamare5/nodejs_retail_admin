const usermasterwholesale = require("../models/user_master_wholesale.js");
const cartMaster = require("../models/cartmaster.js");
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const addressCollection = require("../models/address_master.js");

const randomStrings = (length) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

const addaccount = async (req, res) => {
    const Type = req.body.Type;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (Type == "sign_with_email") {

        const Email = req.body.Email;
        const Password = req.body.Password;
        const Firstname = req.body.Firstname;
        const Lastname = req.body.Lastname;
        const Phone = req.body.Phone;
        const address = req.body.address;
        const city = req.body.city;
        const zipcode = req.body.zipcode;
        const state = req.body.state;
        const country = req.body.country;
        const category_name = req.body.category_name;
        const membership = req.body.membership;

        if (!emailRegex.test(Email)) {
            return res.json({
                status: "ok",
                message: "Email is not valid!",
                flag: "0"
            });
        } else if (Email == null || Email === "" || typeof Email === 'undefined') {
            return res.json({
                status: "ok",
                message: "Email is not Required!",
                flag: "0"
            });
        } else if (Password == null || Password === "" || typeof Password === 'undefined') {
            return res.json({
                status: "ok",
                message: "Password is Required!",
                flag: "0"
            });
        } else if (Firstname == null || typeof Firstname === 'undefined') {
            return res.json({
                status: "ok",
                message: "First Name is Required!",
                flag: "0"
            });
        } else {
            const emailCount = await usermasterwholesale.find({ Email: Email });
            const phoneCount = await usermasterwholesale.find({ Phone: Phone });

            if (emailCount.length) {
                return res.json({
                    status: "ok",
                    message: "Email Id already exist..",
                    flag: "0"
                });
            } else if (phoneCount.length) {
                return res.json({
                    status: "ok",
                    message: "Phone number already exist..",
                    flag: "0"
                });
            } else {

                function hashPassword(Password) {
                    return crypto.createHash('md5').update(Password).digest('hex');
                }

                const hashedPassword = hashPassword(Password);
                console.log('MD5 Hashed Password:', hashedPassword);
                const date = new Date().toISOString().slice(0, 10);

                const userResult = new usermasterwholesale({
                    user_type: 'retail',
                    user_fname: Firstname,
                    user_lname: Lastname,
                    Phone: Phone,
                    Email: Email,
                    Password: hashedPassword,
                    send_key: Password,
                    Date: date,
                    membership_status: membership
                });
                const savedUser = await userResult.save();
                // Get the inserted user ID
                const userId = savedUser._id;
                console.log("userId", userId);


                const addressmaster = new addressCollection({
                    user_id: userId,
                    first_name: Firstname,
                    last_name: Lastname,
                    address: address,
                    address2: '',
                    country: country,
                    state: state,
                    city: city,
                    pincode: zipcode,
                    phone_no: Phone,
                    whatsapp_no: '',
                    email_id: Email,
                    gst_no: '',
                    type: '1'
                });

                const savedAddress = await addressmaster.save();

                if (userId == null || userId === "") {
                    return res.json({
                        status: "ok",
                        message: "Something is wrong, please try again!",
                        flag: "0"
                    });
                } else {
                    const session_id = req.headers['session-id'];

                    const cartData = await cartMaster.find({ UserID: session_id });
                    if (cartData.length) {
                        await cartMaster.updateMany({ UserID: userId }, { $set: { UserID: session_id } });
                    }

                    /* const  UserID = req.session.UserID;
                    const  UserName = req.session.UserName;
                    const  UserEmail = req.session.UserEmail;
                    const  loginKey = req.session.loginKey;
                    const  member_page = req.session.member_page; */

                }
            }
        }
        res.json({ status: 'ok', message: 'User updated successfully', flag: '1' });
    }

    if (Type == "login_with_email") {
        const { Email, Password } = req.body;
        // console.log("req.body",req.body);

        const passwordHash = crypto.createHash('md5').update(Password).digest('hex');
        const userdata = await usermasterwholesale.find({ Email: Email, Password: passwordHash });

        if (userdata.length) {
            const user = userdata[0];
           // console.log(user._id);
           // console.log(user.user_type);
           const login_key = randomStrings(10);
           user.login_key = login_key; // Update the login key
            await user.save(); // Save the updated user

            const uid = req.sessionID;
            const cartdata = await cartMaster.find({UserID : uid});
            if(cartdata.length){
                await CartMaster.updateMany({ UserID: uid }, { $set: { UserID: user._id } });
            }

            const mobile = user.Phone
            const first_name = user.user_fname
            const last_name = user.user_lname
            const user_type = user.user_type
            const userid = user.user_id

            req.session.UserID = userid;
            req.session.user_type = user_type
            req.session.User_name = `${first_name} ${last_name}`;
            req.session.login_key = login_key;


            const response = {
                status: "ok",
                flag: "1",
                userid: userid,
                user_type: user_type,
                mobile:mobile,
                email: Email,
                name: `${first_name} ${last_name}`,
                fname: first_name,
                lname: last_name,
                whatsno: user.Whatsno,
                uid: uid, // Optionally include the session ID in the response
            };
            return res.json(response);

        } else {
            return res.json({
                status: "ok",
                message: "Username or Password incorrect!",
                flag: "0"
            });
        }


    }

}

module.exports = {
    addaccount,
}