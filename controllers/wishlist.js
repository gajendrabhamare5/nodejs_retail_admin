const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const Wishlist = require("../models/wishlist");
const product = require("../models/product.js")

const getwishlistInfo = async (req, res) => {
    const wishlistItems = await Wishlist.find({ user_id: userId, wishlist_type: 'catalog' });

    if (wishlistItems.length > 0) {
        const productIds = wishlistItems.map(item => item.product_id);

        // Fetch corresponding products from the product_master collection
        const products = await Product.find({ product_id: { $in: productIds } });

        // Loop through the products and call product_design function
        products.forEach(product => {
            product_design(product, 'wishlist'); // Modify as needed
        });
    }
    res.render("web/views/wishlist")
}

const addwishlistpro = async (req,res) => {
    const { cart_type, add_type, product_id, filename } = req.body;
    const uid = 22;

    try {
        if (cart_type === "count") {
            const count = await Wishlist.countDocuments({ user_id: uid, wishlist_type: "catalog" });
            return res.json({ message: count });
        }

        if (cart_type === "remove") {
            await Wishlist.deleteOne({ user_id: uid, product_id, wishlist_type: "catalog" });
            const count = await Wishlist.countDocuments({ user_id: uid, wishlist_type: "catalog" });
            return res.json({ message: count });
        }

        if (cart_type === "catalog" || cart_type === "product") {
            const existing = await Wishlist.findOne({ user_id: uid, product_id, wishlist_type: cart_type });
            if (!existing) {
                await Wishlist.create({ user_id: uid, product_id, wishlist_type: cart_type });
                /* console.log("add called"); */
                return res.json({ message: "add" });

            } else {
                if (add_type === "addtocart") {
                    return res.json({ message: "add" });
                }
                await Wishlist.deleteOne({ user_id: uid, product_id, wishlist_type: cart_type });
               /*  console.log("delete called"); */

                const remaining = await Wishlist.countDocuments({ user_id: uid });
                if (filename === "wishlist_file" && remaining === 0) {
                    return res.json({ message: cart_type === "catalog" ? "emptyc" : "empty" });
                }
                return res.json({ message: "remove" });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    getwishlistInfo,
    addwishlistpro,

}