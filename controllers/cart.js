const product_master = require("../models/product");
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
        console.log("body", req.body);

        try {
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
                let message;
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

                return res.status(400).json({ status: "error", message })

            } else {
                if (cartData) {

                    const updatecartdata = await Cart.updateOne(
                        { UserID: uid, ProID: proid, Size: { $regex: new RegExp(`^${Size.toLowerCase()}$`, 'i') }, cartType: Cart_type },
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

                const weightTotal= validProduct.product_weight * qty;
                item.weightTotal = weightTotal;

            } else {
                await Cart.delete({ ProID: proidg });
            }
        }));
        console.log("Total Price:", total);

        // Render the view with updated cart items
        res.render("web/views/cart", { cartItems,total });

    } catch (error) {
        console.error("Error in viewcart:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    addtocart,
    viewcart,
}