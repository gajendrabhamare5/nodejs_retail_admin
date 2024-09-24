const product_master = require("../models/product");
const Size = require("../models/size")
const sizerelationMaster = require("../models/size_relation_master.js")
const Cart = require("../models/cartmaster.js")
const Scheme = require("../models/schememaster.js")

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
        console.log("body", req.body);

        try {
            const cartData = await Cart.find({
                UserID: uid,
                ProID: proid,
                Size: { $regex: new RegExp(`^${Size.toLowerCase()}$`, 'i') },
                cartType: Cart_type
            });
            console.log("cartData",cartData);

            let oldqty = 0;
            if (cartData && cartData.length > 0) {
                oldqty = cartData[0].Qty;
            }
           /*  let oldqty = cartData ? cartData.Qty : 0;
            console.log("oldqty",oldqty); */

            let newqty = oldqty + qty;
            console.log("newqty",newqty);

            let stock = 0;

            if (Size) {

                const sizeRelation = await sizerelationMaster.find({ product_id: proid, size: { $regex: new RegExp(Size.toLowerCase(), 'i') } });
                stock = sizeRelation ? sizeRelation.size_qty : 0;
                console.log("size stock",stock);

            } else {

                const product = await product_master.find({ product_id: proid });
                stock = product ? product.product_qty : 0;
                console.log("stock",stock);
            }
            if (stock < newqty) {

                let message;
                if (stock > 0) {
                        message = `Only ${stock} stocks are available`;
                } else {
                    message = "Out of Stock";
                }

                return res.status(400).json({ status: "error", message })

            } else {
                if (cartData) {

                    const updatecartdata = await Cart.updateOne(
                        { UserID: uid, ProID: proid, Size: { $regex: new RegExp(`^${Size.toLowerCase()}$`, 'i') }, cartType: Cart_type },
                        { $set: { Qty: newqty } }
                    );
                    //  console.log("updatecartdata",updatecartdata);
                } else {
                        console.log("inn else");

                    const newData = new Cart({
                        UserID: uid,
                        ProID: proid,
                        Qty: qty,
                        Size: Size,
                        DateTime: datetime,
                        cartType: Cart_type
                    });
                    const savedata = await newData.save();
                    console.log("Inserted new cart item",savedata);

                }
               // res.status(200).json({ status: "ok", message: "Inserted to card" });
            }

            if (carttype1 == "buy") {
                const deletedata = await Cart.deleteMany({ UserID: uid, ProID: { $ne: proid } });
            }

            const cartItems = await Cart.find({ UserID: uid }).sort({ _id: -1 });
            const rowcount = cartItems.length;

            return res.status(200).json({
                status: "ok",
                count: rowcount,
                message: "success",
                stock: stock,
                qu: ""
            });

        } catch (error) {
            console.error("Error in addtocart:", error);
            return res.status(500).json({ status: "error", message: "Internal server error" });
        }
        // Send response
        // res.status(200).json(response);

    }

    if (type == "delete_cart") {
        let uid = 22;
        const cid = req.body.CID;
        const cartType = req.body.CType;

        try {
            if (cartType === "All") {
                await Cart.deleteMany({ UserID: uid });
            } else {
                await Cart.findByIdAndDelete(cid);
            }

            // Fetch updated cart count
            const updatedCart = await Cart.find({ UserID: uid });
            const rowCount = updatedCart.length;

            const response = {
                status: "ok",
                count: rowCount,
            };

            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: "An error occurred." });
        }


    }

    res.render("web/views/cart")
}

const viewcart = async (req, res) => {
    try {
        const uidNew = "22"; // Replace with req.user.id in a real application
        const cartItems = await Cart.find({ UserID: uidNew }).sort({ Id: -1 });
        let total = 0;
        // console.log("cartItems",cartItems);

        // Use Promise.all to handle asynchronous operations in forEach
        await Promise.all(cartItems.map(async (item) => {
            const { ProID: proidg, Size, cartType, Qty: qty } = item;

            // Fetch product details
            let validProduct;
            if (cartType === "catalog") {
                validProduct = await product_master.findOne({ _id: proidg, product_qty: { $ne: 0 } });
                // console.log("validProduct",validProduct);

            } else if (cartType === "catalog_product") {
                validProduct = await ProductMaster.aggregate([
                    {
                        $lookup: {
                            from: 'catalogmasters',
                            localField: 'catalog_id',
                            foreignField: 'catalog_id',
                            as: 'catalog'
                        }
                    },
                    { $match: { 'catalog.catalog_id': proidg, product_qty: { $ne: 0 } } }
                ]);
            }

            // Attach the product details and quantity to the cart item
            if (validProduct) {
                item.fetch_product = validProduct;
                item.qty = qty;

                const price = validProduct.product_sale_price;
                const catalog_pcs = parseFloat(validProduct.catalog_pcs) || 0;
                const rate1 = price * catalog_pcs;
                const qrate = rate1 * qty * catalog_pcs;
                total += qrate;

                const weightTotal = validProduct.product_weight * qty;
                item.weightTotal = weightTotal;
                item.qrate = qrate;

            } else {
                await Cart.delete({ ProID: proidg });
            }
        }));
        // console.log("Total Price:", total);

        // Render the view with updated cart items
        res.render("web/views/cart", { cartItems, total });

    } catch (error) {
        console.error("Error in viewcart:", error);
        res.status(500).send("Internal Server Error");
    }
};

const updatetocart = async (req,res)=>{
    const cid = req.body.CID
    const Qty = req.body.Qty

    try {

        const cartItem = await Cart.findById(cid);
        if (!cartItem) {
            return res.status(404).json({ status: "error", message: "Cart item not found." });
        }

        const { ProID: proid, Qty: oldqty, Size } = cartItem;
        const userId = cartItem.UserID;
        const pro_id = cartItem.ProID;
        let stock = 0;

        if (Size) {
            const sizeRelation = await sizerelationMaster.find({ product_id: proid, size: '6663d8bba0d6b7b7b9f63f5a' });
            stock = sizeRelation ? sizeRelation.size_qty : 0;

        } else {
            const product = await product_master.findOne({ product_id: proid });
            stock = product ? product.product_qty : 0;
        }

       // let newqty = Math.abs(oldqty - Qty);

        if (stock < Qty) {
            if (stock > 0) {
                cartItem.Qty = stock;
                await cartItem.save();
                return res.json({
                    status: "error",
                    message: `Only ${stock} stocks are available.`,
                });
            } else {
                cartItem.Qty = 0;
                await cartItem.save();
                return res.json({
                    status: "error",
                    message: "Out of Stock",
                });
            }
        } else {
            cartItem.Qty = Qty;
            await cartItem.save();
        }

        // Retrieve the updated cart item
        const updatedCartItem = await Cart.findById(cid);
        const product = await product_master.find({ product_id: proid });
        const product_price = product.product_sale_price;

        const gst_option_value = product.product_gst || 5;
        const rate1 = product_price; // Assuming no catalog_pcs adjustment here
        const total = rate1 * updatedCartItem.Qty;

        const payment_fees_amount1 = (total * gst_option_value) / 100;

        const response = {
            status: "ok",
            total: rate1,
            subtotal: total + payment_fees_amount1,
            gst: `${gst_option_value}%`,
            gstperproduct: payment_fees_amount1,
            message: "",
            qty: updatedCartItem.Qty,
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "An error occurred." });
    }

}

const viewcartscheme = async(req,res)=>{

    const uidNew = 22
    let cart_product = [];
    let cat_qty = {};
    let cat_item = [];
    let total = 0;

    const cartItems = await Cart.find({ UserID: uidNew }).sort({ Id: -1 });

    for (const f2g of cartItems) {
        const { ProID: proidg, Size, cartType, Qty: oldqty } = f2g;

        let checkProductValid;
        if (cartType === 'catalog') {
            checkProductValid = await product_master.find({ product_id: proidg, product_qty: { $ne: 0 } });
        } else if (cartType === 'catalog_product') {
            checkProductValid = await product_master.find({ catalog_id: proidg, product_qty: { $ne: 0 } });
        }

        if (!checkProductValid) {
            await Cart.deleteOne({ ProID: proidg });
            continue;
        }

        let stock = 0;
        if (Size) {
            const sizeRelationData = await sizerelationMaster.find({ product_id: proidg, size: Size });
            stock = sizeRelationData ? sizeRelationData.size_qty : 0;
        } else {
            const productData = await product_master.find({ product_id: proidg });
            stock = productData ? productData.product_qty : 0;
        }

        if (stock < oldqty) {
            if (stock === 0) {
                await Cart.deleteOne({ ProID: proidg, cartType });
            } else {
                await Cart.updateOne({ UserID: uidNew, ProID: proidg, Size }, { Qty: stock });
            }
        }

        cart_product.push(proidg);
        cat_qty[proidg] = oldqty;
    }

    const relationQuery = await Scheme.find({
        product_id: { $regex: new RegExp(cart_product.join('|')) },
        scheme_delete: false
    });

    const scheme_array = [];

    for (const scheme of relationQuery) {
        const { id: scheme_id, buy_qty, free_qty, gift_product_id, category_id, product_id } = scheme;
        const product_id_array = product_id.split(',');
        let tot_cart_qty = 0;

        for (const val of product_id_array) {
            if (cat_qty[val]) {
                tot_cart_qty += cat_qty[val];
            }
        }

        const total_qty = buy_qty + free_qty;
        scheme_array.push({
            id: scheme_id,
            category_id,
            product_id,
            gift_product_id,
            cart_limit: scheme.cart_limit,
            buy_qty,
            free_qty,
            total_qty,
            apply_qty: tot_cart_qty,
            scheme_name: scheme.scheme_name,
        });
    }

    for (const f2 of cartItems) {
        const { ProID: proid, cartType, Size, Qty } = f2;
        const productData = await product_master.find({ product_id: proid });

        if (!productData) continue;

        const { product_sale_price, product_gst, product_name, product_seo_url, product_weight, product_point, is_point_visible } = productData;

        const catalog_pcs = 1;
        const per_product_weight = product_weight * Qty;
        const qrate = product_sale_price * Qty * catalog_pcs;

        total += qrate;

        let product_point1 = product_point ? Math.round((qrate * product_point) / 100) : 0;

        // Handle offers
        let offer_applied = false;
        let offer = '';
        let text_applied = '';

        const all_scm = scheme_array.filter(s => s.product_id.includes(proid));
        if (all_scm.length > 0) {
            for (const val of all_scm) {
                const apply_qty = val.apply_qty;
                const newqty_show = val.total_qty - apply_qty;
                offer = val.scheme_name;


                if (apply_qty >= val.total_qty) {
                    text_applied = 'offer applied';
                    offer_applied = true;
                    await Cart.updateOne({ ProID: proid, UserID: uidNew }, { offer_applied: true, offer_applied_id: val.id });
                } else {
                    offer_applied = false;
                    text_applied = `Add ${newqty_show} more item to avail this offer`;
                    await Cart.updateOne({ ProID: proid, UserID: uidNew }, { offer_applied: false });
                }
            }
        }

        cat_item.push({
            ccid: f2._id,
            proid,
            Size,
            qty: Qty,
            product_point: product_point,
            product_point1,
            product_seo_url,
            product_name,
            per_product_weight,
            catalog_pcs,
            qrate,
            offer_applied,
            offer,
            text_applied,
        });
    }

    const response = {
        cartitem: cat_item,
        total,
        scheme_array,
        cou: cat_item.length,
    };

    res.json(response);

}

module.exports = {
    addtocart,
    viewcart,
    updatetocart,
    viewcartscheme,
}