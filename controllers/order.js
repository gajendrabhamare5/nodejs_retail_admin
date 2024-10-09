const country_master = require("../models/country.js")
const CodCharge = require("../models/codcharge.js")
const CartMaster = require("../models/cartmaster.js")
const product_master = require("../models/product");
const crypto = require('crypto');
const sizerelationMaster = require("../models/size_relation_master.js")
const AddressMaster = require("../models/address_master.js")
const ViewCount = require("../models/viewcount.js")
const UserMaster = require("../models/user_master_wholesale.js")
const order_address_master = require("../models/order_address_master.js")
const order_master = require("../models/order_master.js")

const placeorder = async (req, res) => {

    
    let uid;
    if (req.session.UserID) {
        uid = req.session.UserID;
    } else {
        uid = req.sessionID;
    }

    let a = "";
    let userid;
    let cartuserid;

    if (req.session.UserID) {
        userid = req.session.UserID;
        cartuserid = userid;
    } else {
        const guest_id = req.sessionID;
        cartuserid = guest_id;

        // Fetch user by guest_id
        const fetchUser = await UserMaster.find({ guest_id: guest_id });

        if (fetchUser) {
            userid = fetchUser.user_id;
        } else {
            userid = null; // Handle case where user is not found
        }
    }
    let total_point = 0;

    if (userid) {

        const cartItems = await CartMaster.find({ UserID: cartuserid }).sort({ Id: -1 });
        for (const item of cartItems) {
            const { ProID: proidg, Size, Id: ccid, cartType, Qty: oldqty } = item;
            let newqty = oldqty;

            // Check if product exists
            const product = await product_master.find({ product_id: proidg });
            if (!product) {
                await CartMaster.deleteOne({ ProID: proidg });
                continue;
            }

            let stock = 0;
            if (Size) {
                const sizeRelation = await sizerelationMaster.find({
                    product_id: proidg,
                    'size_master.size_name': { $regex: new RegExp(Size, 'i') }
                });

                if (sizeRelation) {
                    stock = sizeRelation.size_qty || 0;
                }
            } else {
                stock = product.product_qty || 0;
            }

            if (stock < newqty) {
                if (stock === 0) {
                    await CartMaster.delete({ ProID: proidg, cartType });
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
            }
        }
    }

}

module.exports = {
    placeorder,
}