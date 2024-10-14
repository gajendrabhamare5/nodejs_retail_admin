const country_master = require("../models/country.js")
const CodCharge = require("../models/codcharge.js")
const CartMaster = require("../models/cartmaster.js")
const product_master = require("../models/product");
const crypto = require('crypto');
const sizerelationMaster = require("../models/size_relation_master.js")
const sizeMaster = require("../models/size.js");
const AddressMaster = require("../models/address_master.js")
const ViewCount = require("../models/viewcount.js")
const UserMaster = require("../models/user_master_wholesale.js")
const order_address_master = require("../models/order_address_master.js")
const order_master = require("../models/order_master.js")
const orderProductmaster = require("../models/order_product_master.js")

const placeorder = async (req, res) => {



    let uid;
    if (req.session.UserID) {
        uid = req.session.UserID;
    } else {
        uid = req.sessionID;
    }

    let a = "";
    let userid="22";
    let cartuserid = "22";

    /* if (req.session.UserID) {
        userid = req.session.UserID;
        cartuserid = userid;
    } else {
        const guest_id = req.sessionID;
        cartuserid = guest_id;
        const fetchUser = await UserMaster.find({ guest_id: guest_id });

        if (fetchUser) {
            userid = fetchUser.user_id;
        } else {
            userid = null;
        }
    } */
    let total_point = 0;
    // console.log("userid",userid);


    if (userid) {

        const cartItems = await CartMaster.find({ UserID: cartuserid }).sort({ Id: -1 });
        console.log("cartItems",cartItems);

        for (const item of cartItems) {
            const { ProID: proidg, Size, Id: ccid, cartType, Qty: oldqty } = item;
            let newqty = oldqty;

            // Check if product exists
            const product = await product_master.find({ _id: proidg });
            console.log("product",product);

            if (!product) {
                await CartMaster.deleteOne({ ProID: proidg });
                continue;
            }

            let stock = 0;

            console.log("Size",Size);

            if (Size) {

                const sizeRelation = await sizerelationMaster.aggregate([
                    {
                        $lookup: {
                            from: 'size_masters',         // The collection to join
                            localField: 'size_id',      // Field from size_relation_master
                            foreignField: '_id',    // Field from size_master
                            as: 'sizeDetails'            // Name of the output array
                        }
                    },
                    {
                        $project: {
                            product_id: 1,              // Include product_id in the output
                            size_id: 1,                 // Include size_id for reference
                            sizeDetails: 1               // Include sizeDetails to see the results of the lookup
                        }
                    },
                    {
                        $unwind: '$sizeDetails'        // Flatten the array (if there are multiple matches)
                    },
                    {
                        $match: {
                            product_id: proidg,                // Filter by product_id
                            'sizeDetails.size_name': { $regex: new RegExp(Size, 'i') } // Case-insensitive match
                        }
                    },
                    {
                        $sort: { product_id: 1 }            // Sort by product_id ascending
                    }
                ]);

                console.log("sizeRelation",sizeRelation);

                if (sizeRelation) {
                    stock = sizeRelation.size_qty || 0;
                }
            } else {
                stock = product.product_qty || 0;
            }

            if (stock < newqty) {
                if (stock === 0) {
                    await CartMaster.deleteOne({ ProID: proidg, cartType });
                } else {
                    await CartMaster.update(
                        { UserID: cartuserid, ProID: proidg, Size, cartType },
                        { Qty: stock }
                    );
                }
            }
        }

        let counter_cart = 0;
        const product_names = [];
        const cartData = await CartMaster.find({ UserID: cartuserid });
        for (const item of cartData) {
            const { ProID: product_id, Qty, Size, cartType } = item;

            let product_qty = 0;
            if (Size) {
                const sizeRelation = await sizerelationMaster.findOne({
                    product_id,
                    'size_master.size_name': { $regex: new RegExp(Size, 'i') }
                });

                product_qty = sizeRelation ? sizeRelation.size_qty : 0;
            } else {
                const product = await product_master.find({ product_id });
                product_qty = product ? product.product_qty : 0;
            }

            if (parseInt(product_qty) > 0) {
                counter_cart++;
            } else {
                const product = await product_master.find({ product_id });
                if (product) {
                    product_names.push(product.product_name);
                }
            }
        }
        const cart_count = cartItems.length;
        if (cart_count === counter_cart && counter_cart > 0) {

            const {
                userid, addresstype, shippingid, shiptitle, paymentmethod, billingaddid, shippingaddressid, fullsubtotal,
                fullgrandtot_order, totalgst_order, shipmethodprice_order, handlingcharge_order, paymentmethodpri_order,
                combodiscount_order, wallet_point_order, discount, coupon, cartuserid } = req.body;

                console.log("req.body",req.body);


            const billingAddress = await AddressMaster.findById(billingaddid);
            const {
                phone_no: Phone,
                first_name,
                country
            } = billingAddress;

            const shippingAddressId = shippingaddressid || billingaddid;
            let shippingAddress = {};
            if (addresstype.toLowerCase() === "shipping" || addresstype.toLowerCase() === "billing") {
                /*   shippingAddress = await Address.findById(shippingAddressId); */
                const addressData = await AddressMaster.find({ address_id: shippingaddressid });
                if (addressData) {
                    const {
                        phone_no: shipping_phone_no,
                        whatsapp_no: shipping_whatsapp_no,
                        country: shipping_country,
                        state: shipping_state,
                        city: shipping_city,
                        pincode: shipping_pincode,
                        email_id: shipping_email_id,
                        first_name: shipping_first_name,
                        last_name: shipping_last_name,
                        address: shipping_address,
                        address2: shipping_address2,
                        gst_no: shipping_shipping_gst_number,
                    } = addressData;

                    // Insert into order_address_master
                    const result = order_address_master.insert({
                        user_id: userid,
                        first_name: shipping_first_name,
                        last_name: shipping_last_name,
                        address: shipping_address,
                        address2: shipping_address2,
                        country: shipping_country,
                        state: shipping_state,
                        city: shipping_city,
                        pincode: shipping_pincode,
                        phone_no: shipping_phone_no,
                        whatsapp_no: shipping_whatsapp_no,
                        email_id: shipping_email_id,
                        gst_no: shipping_shipping_gst_number,
                        type: 2
                    });

                    const address_id = result.insertedId;
                    console.log("Address inserted with ID:", address_id);
                }
            }
            const orderDetails = {
                user_id: userid,
                payment_method: paymentmethod,
                shipping_method: shiptitle,
                address_id: shippingAddressId,
                address_type: addresstype,
                order_subtotal: fullsubtotal,
                order_gst: totalgst_order,
                order_shippingcharge: shipmethodprice_order,
                order_handlingcharge: handlingcharge_order,
                combo_discount: combodiscount_order,
                order_onlinecharge: paymentmethod === 'Direct Bank Transfer' ? 0 : paymentmethodpri_order,
                order_total: fullgrandtot_order,
                coupon_id: coupon || '',
                coupon_amount: discount || 0,
                discount_amount: 0,
                used_wallet_point: wallet_point_order || 0,
                order_status: "Pending",
                order_date: new Date(),
                affiliate_user_id: affiliate_user_id || 0,
                user_type: "retail",
                order_type: "website"
            };

            const date = new Date().toISOString();

            const maxOrderInvoiceDoc = await order_master.find({}, { sort: { order_invoice: -1 }, projection: { order_invoice: 1 } });
            const max_order_invoice = maxOrderInvoiceDoc ? maxOrderInvoiceDoc.order_invoice : 0;


            const order_invoice = max_order_invoice === 0 ? 1 : max_order_invoice + 1;

            let paystatus = "4";
            let redirect_online = 'yes';


            if (grand_total_point === wallet_point && ordertotal === 0 && paymentmethod === 'Online Payments') {
                redirect_online = 'no';
                paystatus = "6";
            }

            let coupon_amt = 0;
            if (typeof global.discount !== 'undefined') {
                coupon_amt = global.discount;
            }
            if (wallet_point) {
                coupon_amt = 0;
            }

            let coupon_point = 0;
            if (typeof global.coupon_point !== 'undefined') {
                coupon_point = global.coupon_point;
            }
            if (!affiliate_user_id) {
                affiliate_user_id = 0;
            }




            const order = await order_master.create(orderDetails);
            const orderid_id = order._id;

            if (discount && coupon) {
                await CouponRelation.create({
                    coupon_name: coupon,
                    coupon_id: coupon,
                    order_id: orderid_id,
                    user_id: userid,
                    discount: discount
                });
                await order_address_master.update({ _id: orderid_id }, { $set: { coupon_id: coupon } });
            }

            const cartItems = await CartMaster.find({ UserID: cartuserid });
            for (const item of cartItems) {
                const { ProID: product_id, Qty, Size, cartType } = item;

                // Fetch product details
                const product = await product_master.findById(product_id);
                let product_qty = product.product_qty;

                // Update inventory
                const newProductQty = product_qty - Qty;
                await product_master.update({ _id: product_id }, { $set: { product_qty: newProductQty } });

                // Insert order product details
                await orderProductmaster.create({
                    order_id: orderid_id,
                    product_id,
                    product_qty: Qty,
                    product_size: Size,
                    product_price: product.product_sale_price,
                    product_gst: product.product_gst,
                    product_weight: product.product_weight,
                    stitch_price: item.Stitch,
                    extra_label: item.extra_name,
                    extra_price: item.extra_price,
                    applied_offer_id: item.offer_applied_id,
                    is_free: item.free_item
                });

                // Handle dealer relation if exists
                if (product.vendor) {
                    const dealer = await Dealer.find({ vendor_sku: product.vendor });
                    if (dealer) {
                        await DealerRelation.create({
                            dealer_id: dealer.dealer_id,
                            order_id: orderid_id
                        });
                    }
                }

                await CartMaster.deleteMany({ UserID: cartuserid });
            } for (const item of cartItems) {
                const { ProID: product_id, Qty, Size, cartType } = item;

                const product = await product_master.findById(product_id);
                let product_qty = product.product_qty;

                // Update inventory
                const newProductQty = product_qty - Qty;
                await product_master.updateOne({ _id: product_id }, { $set: { product_qty: newProductQty } });

                // Insert order product details
                await order_master.create({
                    order_id: orderid_id,
                    product_id,
                    product_qty: Qty,
                    product_size: Size,
                    product_price: product.product_sale_price,
                    product_gst: product.product_gst,
                    product_weight: product.product_weight,
                    stitch_price: item.Stitch,
                    extra_label: item.extra_name,
                    extra_price: item.extra_price,
                    applied_offer_id: item.offer_applied_id,
                    is_free: item.free_item
                });

                // Handle dealer relation if exists
                if (product.vendor) {
                    const dealer = await Dealer.findOne({ vendor_sku: product.vendor });
                    if (dealer) {
                        await DealerRelation.create({
                            dealer_id: dealer.dealer_id,
                            order_id: orderid_id
                        });
                    }
                }

                // Handle wallet points
                if (wallet_point_order) {
                    await UserPoint.create({
                        user_id: userid,
                        order_id: orderid_id,
                        amount: -wallet_point_order,
                        type: 'Debit',
                        remark: `#Used on Order ${orderid_id}`,
                        date: new Date()
                    });
                }
                // Clear the cart
                await CartMaster.deleteMany({ UserID: cartuserid });
                let status = "ok";
                const oid = orderId;
                const result = {
                    status,
                    oid,

                };
                return res.json(result);
            }

        }else{

            let status = "error1";
            const result = {
                status,
            };
            return res.json(result);
        }

        /* sendMail(orderId); */


    }else{
        let msg = `${product_names.join(", ")} is out of stock`;
        if (!counter_cart) {
            msg = "None of the Products(s) you selected are available currently.";
        }
        return res.json({ status: "outofstck", message: msg });
    }

}

module.exports = {
    placeorder,
}