const ChargeRating = require("../models/charge_rating.js");
const CartMaster = require("../models/cartmaster.js")
const product_master = require("../models/product");
const sizerelationMaster = require("../models/size_relation_master.js")

const getshipping = async (req, res) => {

    let uid;

    if (req.session.UserID) {
        uid = req.session.UserID;
    } else {
        uid = req.sessionID; // Use session ID if not logged in
    }

    const sid = req.body.sid; // Assuming you're sending this data in the request body
    const userCountry = req.body.b_country;
    const paymentMethod = req.body.paymentmethod;
    let userType = '';

    const chargeRating = await ChargeRating.find();
    const shippingCharge = chargeRating.shipping_charge || 0;
    const shippingChargeCart = chargeRating.shipping_charge_cart || 0;
    const handlingCharge = chargeRating.handling_charge || 0;

    const cartItems = await CartMaster.find({ UserID: uid })
    let finalProductWeight = 0;
    let total = 0;

    for (const item of cartItems) {
        const { ProID: proId, Qty: proQty, Size } = item;

        // Fetch product details
        const product = await product_master.find({ _id: proId });
        const productPrice = product.product_sale_price;
        const productWeight = product.product_weight;

        // Calculate product total
        const qrate = productPrice * proQty;
        total += qrate;

        // Calculate total weight
        finalProductWeight += productWeight * proQty;

        // Fetch size-related pricing if size is provided
        if (Size) {
            const sizeRelation = await sizerelationMaster
                .aggregate([
                    { $match: { product_id: proId } },
                    {
                        $lookup: {
                            from: 'size_master',
                            localField: 'size_id',
                            foreignField: 'size_id',
                            as: 'sizeDetails'
                        }
                    },
                    { $unwind: '$sizeDetails' },
                    { $match: { 'sizeDetails.size_name': { $regex: new RegExp(`^${Size.toLowerCase()}$`, 'i') } } }
                ])
                .toArray();

            if (sizeRelation.length > 0) {
                const rate12 = sizeRelation[0].sizeDetails.retail_price;

            }
        }
    }

    // Determine shipping costs
    let shippingCost = 0;
    let shippingRate = 0;
    const shippingMethod = [];

    if (total >= shippingChargeCart) {
        shippingCost = 0;
        shippingRate = 0;
    } else {
        shippingCost = shippingCharge;
        shippingRate = shippingCharge;
    }

    const shippingEntry = {
        id: 0,
        title: "Shipping Charge",
        price: shippingCost,
        shipping_rate: shippingRate,
        b_country: req.body.b_country, // Assuming b_country is sent in the request
        total: total,
      };

      shippingMethod.push(shippingEntry);
      let response;

      if (!shippingMethod || shippingMethod.length === 0) {
        response = {
          status: "error",
          message: "Courier service is not providing on this pincode.",
          shipping_method: shippingMethod,
        };
      } else {
        response = {
          status: "ok",
          handling_charge: handlingCharge,
          count: shippingMethod.length,
          shipping_method: shippingMethod,
        };
      }

      res.json(response);

}

module.exports = {
    getshipping
}