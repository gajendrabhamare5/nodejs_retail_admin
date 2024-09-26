const country_master = require("../models/country.js")
const CodCharge = require("../models/codcharge.js")
const CartMaster = require("../models/cartmaster.js")
const product_master = require("../models/product");
const sizerelationMaster = require("../models/size_relation_master.js")
const AddressMaster = require("../models/address_master.js")
const ViewCount = require("../models/viewcount.js")

const getcheckoutInfo = async (req, res) => {
    const countrydata = await country_master.find();
    const codChargeData = await CodCharge.find({ _id: '66bb1235715001fdf14289d2' });
    const cartdata = await CartMaster.find({UserID:22}).sort({ Id: -1 });
   // console.log("cartdata",cartdata);

    await Promise.all(cartdata.map(async (item) => {
        const { ProID: proidg, Size, cartType, Qty: oldqty } = item;

        // Check if the product exists
        const product = await product_master.find({ _id: proidg });
       console.log("product",product);

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
            item.fetch_product = product;
            item.qty = oldqty;

            const price = product.product_sale_price;
            const catalog_pcs = parseFloat(product.catalog_pcs) || 0;
            const rate1 = price * catalog_pcs;
          //  const qrate = rate1 * qty * catalog_pcs;
         //   total += qrate;

           // const weightTotal = product.product_weight * qty;
          //  item.weightTotal = weightTotal;
          //  item.qrate = qrate;

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



    res.render("web/views/checkout",{cartdata,countrydata,codChargeData,codChargeData,billingAddress,shippingAddress})
}

module.exports = {
    getcheckoutInfo,

}