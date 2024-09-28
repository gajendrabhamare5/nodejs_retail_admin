const country_master = require("../models/country.js")
const CodCharge = require("../models/codcharge.js")
const CartMaster = require("../models/cartmaster.js")
const product_master = require("../models/product");
const crypto = require('crypto');
const sizerelationMaster = require("../models/size_relation_master.js")
const AddressMaster = require("../models/address_master.js")
const ViewCount = require("../models/viewcount.js")
const UserMaster = require("../models/user_master_wholesale.js")

const randomStrings = (length) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

const getcheckoutInfo = async (req, res) => {
    const countrydata = await country_master.find();
    const codChargeData = await CodCharge.find({ _id: '66bb1235715001fdf14289d2' });
    const cartdata = await CartMaster.find({ UserID: 22 }).sort({ Id: -1 });
    // console.log("cartdata",cartdata);
    let total = 0;

    await Promise.all(cartdata.map(async (item) => {
        const { ProID: proidg, Size, cartType, Qty: oldqty } = item;

        // Check if the product exists
        const product = await product_master.find({ _id: proidg });
        //console.log("product",product);

        if (!product) {
            // Delete from cart if product does not exist
            await CartMaster.deleteOne({ ProID: proidg });
            return;
        }

        let stock = 0;

        if (Size) {
            // Get size relation
            const sizeRelation = await sizerelationMaster.find({
                product_id: proidg,
                size: { $regex: new RegExp(`^${Size.toLowerCase()}$`, 'i') }
            });
            // console.log("sizeRelation",sizeRelation);

            stock = sizeRelation ? Number(sizeRelation.size_qty) : 0;
        } else {
            stock = Number(product.product_qty);
        }

        // If stock is less than the quantity in the cart, update or delete
        if (stock < oldqty) {
            if (stock === 0) {
                // If no stock, delete the cart item
                await CartMaster.deleteOne({ ProID: proidg, cartType });
            } else {
                // Update the cart with available stock
                await CartMaster.updateOne(
                    { UserID: uid, ProID: proidg, Size, cartType },
                    { Qty: stock }
                );
            }
        }

        if (product) {
            const productData = product[0];

            item.fetch_product = productData;
            item.qty = oldqty;

            const price = productData.product_sale_price;
            // console.log("price",price);

            const catalog_pcs = parseFloat(productData.catalog_pcs) || 0;
            //console.log("catalog_pcs",catalog_pcs);

            const rate1 = price * catalog_pcs;
            // console.log("rate1",rate1);

            const qrate = rate1 * oldqty;
            // console.log("qrate",qrate);

            /*  total += qrate;
             console.log("total",total); */


            // const weightTotal = product.product_weight * qty;
            //  item.weightTotal = weightTotal;
            item.qrate = qrate;

        }

    }));

    if (cartdata.length <= 0) {
        return res.redirect("http://localhost:4000/");
    }

    const billingAddress = await AddressMaster.find({ user_id: 22, type: '1', address_delete: 0 });
    const shippingAddress = await AddressMaster.find({ user_id: 22, type: '2', address_delete: 0 });

    if (!billingAddress) {
        return res.redirect("http://localhost:4000/");
    }

    const {
        address_id,
        phone_no,
        whatsapp_no,
        country = 'INDIA',
        state,
        city,
        pincode,
        email_id,
        first_name,
        last_name,
        address,
        address2,
        gst_no
    } = billingAddress;

    const ip_address = req.ip;
    const site_name = 'Check out Page';
    const count_date = new Date().toISOString().split('T')[0];

    let user_gift_point = 0;
    let user_wallet_point = 0;

    await ViewCount.create({ ip_address, page_name: site_name, date: count_date });

    req.session.coupon = null;
    req.session.discount = null;



    res.render("web/views/checkout", { cartdata, countrydata, codChargeData, billingAddress, shippingAddress })
}

const insertdataaddress = async (req, res) => {
    try {
        const {
            uid, address_id, b_fname, b_lname, b_phone, b_whatsapp_no, b_email, b_address, b_country, b_state, b_city,
            b_postal, gst_no, new_mobile_no, addresstype, s_address, s_postal, s_fname, s_lname, s_phone, s_whatsapp_no,
            s_country, s_state, s_city } = req.body;
       // console.log("body", req.body);

        if (req.session.UserID) {
            const existingAddress = await AddressMaster.find({ user_id: uid, type: 1 });
           // console.log("existingAddress", existingAddress);

            if (existingAddress) {
                // Update existing billing address
                existingAddress.first_name = b_fname;
                existingAddress.last_name = b_lname;
                existingAddress.address = b_address;
                existingAddress.country = b_country;
                existingAddress.state = b_state;
                existingAddress.city = b_city;
                existingAddress.pincode = b_postal;
                existingAddress.phone_no = b_phone;
                existingAddress.whatsapp_no = b_whatsapp_no;
                existingAddress.email_id = b_email;
                existingAddress.gst_no = gst_no;

                await existingAddress.save();
                return res.json({ status: 'success', message: 'Billing address updated' });
            } else {
                // Insert new billing address
                const newAddress = new AddressMaster({
                    user_id: uid,
                    first_name: b_fname,
                    last_name: b_lname,
                    address: b_address,
                    country: b_country,
                    state: b_state,
                    city: b_city,
                    pincode: b_postal,
                    phone_no: b_phone,
                    whatsapp_no: b_whatsapp_no,
                    email_id: b_email,
                    gst_no: gst_no,
                    type: 1 // Billing address
                });
                await newAddress.save();
                return res.json({ status: 'success', message: 'Billing address added', address_id: newAddress._id });
            }

        } else {
            const guest_id = req.sessionID;
           // console.log("guest_id", guest_id);

            const users = await UserMaster.find({ Phone: new_mobile_no });
           // console.log("user", users);

            if (users.length > 0) {
                for (const user of users) {
                    user.guest_id = guest_id;
                    await user.save();
                    let addresses = await AddressMaster.find({ user_id: user._id, type: 1 });
                    //console.log("address",addresses);

                    if (addresses.length > 0) {
                        for (const address of addresses) {
                        address.guest_id = guest_id;
                        address.first_name = b_fname;
                        address.last_name = b_lname;
                        address.address = b_address;
                        address.country = b_country;
                        address.state = b_state;
                        address.city = b_city;
                        address.pincode = b_postal;
                        address.phone_no = b_phone;
                        address.whatsapp_no = b_whatsapp_no;
                        address.email_id = b_email;
                        address.gst_no = gst_no;
                        await address.save();
                    }
                }
                }
            } else {
                const rand_pass = '123456';
                function hashPassword(rand_pass) {
                    return crypto.createHash('md5').update(rand_pass).digest('hex');
                }
                const hashedPassword = hashPassword(rand_pass);
                const datee = new Date();

                const newUser = new UserMaster({
                    guest_id,
                    user_fname: b_fname,
                    Email: b_email,
                    Phone: new_mobile_no,
                    send_key: rand_pass,
                    Password: hashedPassword,
                    Date: datee
                });

                user = await newUser.save();

                const newAddress = new AddressMaster({
                    user_id: user._id,
                    guest_id,
                    first_name: b_fname,
                    last_name: b_lname,
                    address: b_address,
                    country: b_country,
                    state: b_state,
                    city: b_city,
                    pincode: b_postal,
                    phone_no: b_phone,
                    whatsapp_no: b_whatsapp_no,
                    email_id: b_email,
                    gst_no: gst_no,
                    type: 1
                });

                await newAddress.save();

                const referral_code = randomString(10);
                const login_key = randomString(10);

                user.referral_code = referral_code;
                user.login_key = login_key;
                await user.save();

                // Handle referral logic
                const login_via_referralcode = req.session.referral_code_customer?.slice(0, 10);
                if (login_via_referralcode) {
                    const referredUser = await UserMaster.find({ referral_code: login_via_referralcode });
                    if (referredUser) {
                        user.referred_user_id = referredUser._id;
                        await user.save();


                    }
                }
            }
        }

        if (addresstype == "Shipping") {
            const { s_fname, s_lname, s_phone, s_whatsapp_no, s_address, s_country, s_state, s_city, s_postal } = req.body;

            let shipping_id = 0;

            // Check for existing shipping address
            const existingAddress = await AddressMaster.find({
                user_id: uid,
                type: 2,
                address: s_address,
                pincode: s_postal
            });

            if (existingAddress) {
                shipping_id = existingAddress._id; // Use _id for MongoDB
            } else {
                // Insert new shipping address
                const newAddress = new AddressMaster({
                    user_id: uid,
                    first_name: s_fname,
                    last_name: s_lname,
                    address: s_address,
                    country: s_country,
                    state: s_state,
                    city: s_city,
                    pincode: s_postal,
                    phone_no: s_phone,
                    whatsapp_no: s_whatsapp_no,
                    type: 2
                });
                const savedAddress = await newAddress.save();
                shipping_id = savedAddress._id;
            }

            const response = {
                status: "ok",
                shipping_id: shipping_id
            };

            res.json(response);
        }
            res.json({ status: "ok", billing_id: address_id });


    } catch (error) {
        console.error(error);
        res.json({ status: "error", message: "An error occurred." });
    }
}

const storevalue = async (req,res)=> {
    const { value, name } = req.body;

    const sessionStore = {};
    if (!value || !name) {
        return res.status(400).json({ status: 'error', message: 'Invalid input' });
    }

    sessionStore[name + '_order'] = value;

    res.json({
        status: 'ok',
        price: value,
    });
}

module.exports = {
    getcheckoutInfo,
    insertdataaddress,
    storevalue,
}