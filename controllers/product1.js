const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const mongoose = require('mongoose');

const Category = require("../models/category");
const SubCategory = require("../models/subcategory");
const product_master = require("../models/product");
const relationMaster = require("../models/relation_master")
const Size = require("../models/size")
const sizerelationMaster = require("../models/size_relation_master.js")

const getportproductInfo = async (req, res) => {
    const id = req.params.id;
    const pro_data = await product_master.find({product_seo_url:id});


    pro_data.forEach(doc => {
        doc._id = doc._id.toString(); // Convert to string
    });

    const sizeDataArray = [];
    for (const doc of pro_data) {

        const product_id1 = doc._id;
        // console.log('Type of product_id:', typeof product_id1);
        const product_id = new mongoose.Types.ObjectId(product_id1);
        // const sizerelationdata = await sizerelationMaster.find({product_id:product_id});
        const sizeIds = await sizerelationMaster.distinct('size_id', { product_id: product_id });
        // console.log('Size IDs:', sizeIds);

// Check size_masters for corresponding _id values
const sizes = await Size.find({ _id: { $in: sizeIds } });
// console.log('Sizes found in size_masters:', sizes);

const initialMatch = await sizerelationMaster.find({ product_id: product_id});
// console.log('Direct query result:', JSON.stringify(initialMatch, null, 2));

const lookupStage = await sizerelationMaster.aggregate([
    { $match: { product_id: product_id } },
    { $lookup: { from: "size_masters",
        let: { sizeId: { $toObjectId: "$size_id" } },
        pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$sizeId"] } } }
        ],
          as: "sizeDetails" } }
]);
//console.log('After lookup stage:', JSON.stringify(lookupStage, null, 2));


       const aggregation = [
        {
            $match: {
                product_id: product_id,
                size_id: { $ne: 0 } // Ensure size_id is not 0
            }
        },
        {
            $lookup: {
                from: 'Size',
                localField: 'size_id',
                foreignField: '_id',
                as: 'sizeDetails'
            }
        },
        {
            $unwind: {
                path: '$sizeDetails',
                preserveNullAndEmptyArrays: false
            }
        },
        {
            $group: {
                _id: '$size_id',
                size_qty: { $first: '$size_qty' },
                sizeDetails: { $first: '$sizeDetails' }
            }
        },
        {
            $sort: {
                'sizeDetails.size_id': 1
            }
        },
        {
            $project: {
                size_qty: 1,
                size_id: '$sizeDetails.size_id',
                size_name: '$sizeDetails.size_name', // Include additional fields as needed
                size_image: '$sizeDetails.size_image' // Example field from sizeDetails
            }
        }
    ];

    // console.log("aggregation",aggregation);

    const result = await sizerelationMaster.aggregate(aggregation);
    //console.log("Size data:",JSON.stringify(result, null, 2));
    sizeDataArray.push({ product: doc, sizes: result });

    };

    res.render("web/views/product",{pro_data,sizeDataArray })

}

module.exports = {
    getportproductInfo,

}