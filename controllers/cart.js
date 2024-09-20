const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const mongoose = require('mongoose');

const product_master = require("../models/product");
const relationMaster = require("../models/relation_master")
const Size = require("../models/size")
const sizerelationMaster = require("../models/size_relation_master.js")
const Cart = require("../models/cartmaster.js")

const addtocart = async (req, res) => {
    const type = req.body.Type;
    //console.log("type", type);

    if (type == "add_to_cart") {
        let uid = 22;
        /*   if (req.session.UserID) {
            uid = req.session.UserID;
        } else {

            req.session.UserID = req.sessionID;
            uid = req.sessionID;
        } */
        const Size = req.body.Size
        const sizeid = req.body.sizeid
        const carttype1 = req.body.carttype1
        const proid = req.body.ProId
        const qty = req.body.Qty
        const Cart_type = req.body.Cart_type
        const datetime = new Date();

        const cartData = await Cart.find({
            UserID: uid,
            ProID: proid,
            Size: { $regex: new RegExp(`^${Size.toLowerCase()}$`, 'i') },
            cartType: Cart_type
        });

        let oldqty = cartData ? cartData.Qty : 0;
        let newqty = oldqty + qty;
        let stock = 0;

        if (Size) {

            const sizeRelation = await sizerelationMaster.find({ product_id: proid, size: { $regex: new RegExp(Size.toLowerCase(), 'i') } });
            stock = sizeRelation ? sizeRelation.size_qty : 0;
        } else {

            const product = await product_master.find({ product_id: proid });
            stock = product ? product.product_qty : 0;
        }
        if (stock < newqty) {
            let status = "error";
            let message = "";
            if (stock > 0) {
                if (!oldqty) {
                    // oldqty is empty
                    message = `Only ${stock} stocks are available`;
                } else {
                    // oldqty is not empty
                    message = `Only ${stock} stocks are available`;
                }
            } else {
                message = "Out of Stock";
            }
            if (stock < 0) {
                newqty = 0;
            }
        } else {
            if (cartData) {

             const updatecartdata= await Cart.updateOne(
                    { UserID: uid,ProID:proid, Size: { $regex: new RegExp(`^${Size.toLowerCase()}$`, 'i') },cartType:Cart_type },
                    { $set: { Qty: newqty } }
                );
              //  console.log("updatecartdata",updatecartdata);


            } else {

                const newData = new Cart({
                    UserID: uid,
                    ProID: proid,
                    Qty: qty,
                    Size: Size,
                    DateTime: datetime,
                    cartType: Cart_type
                });
              const savedata = await newData.save();
             // console.log("Inserted new cart item",savedata);

            }
            res.status(200).json({ status: "ok", message: "Inserted to card" });
        }

        if(carttype1=="buy"){
          const deletedata =  await Cart.deleteMany({ UserID: uid, ProID: { $ne: proid } });
        }

        const cartItems = await Cart.find({ UserID: uid }).sort({ _id: -1 });
        const rowcount = cartItems.length;
        const response = {
            status: "ok",
            count: rowcount,
            message: "success",
            stock: stock,
            qu: ""
        };

        // Send response
        res.status(200).json(response);

    }

    res.render("web/views/cart")
}

module.exports = {
    addtocart,
}