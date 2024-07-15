const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const handlebars = require('handlebars');
const helpers = require('handlebars-helpers')();

const Product = require("../models/product");
const SizerelationMaster = require("../models/size_relation_master")
const relationMaster = require("../models/relation_master")
const Category = require("../models/category");
const SubCategory = require("../models/subcategory");
const productSubimage = require("../models/product_subimage")
const brandRelation = require("../models/brand_relation_master.js")

const getproductInfo = async (req, res) => {

    try {

        const sqlData = await Product.find().sort({ _id: 'desc' });
        let num = 0;
        const data_product = [];

        for (const fetch of sqlData) {
            const productid = fetch._id;

            const qty = fetch.product_qty;
            const sizerelation = await SizerelationMaster.find({ product_id: productid, size_type: 'catalog' })
            let sku;
            if (sizerelation.length > 0) {
                let show_all = ''
                sizerelation.forEach(function (fetch_product) {
                    let show1 = fetch_product.product_sku + ' (' + fetch_product.size_qty + ')';
                    show_all += show1;
                });

                sku = `<div class="demo-inline-spacing popover-demo"><button type="button" onclick="popover()" class="btn          btn-default" data-html="true" data-toggle="popover" data-placement="top" data-content="' . ${show_all} . '" title="SKU ( QTY )">SKU</button></div>`

            } else {
                sku = fetch.product_sku
            }

            const pcs = fetch.catalog_pcs;
            const name = fetch.product_name;

            let image = fetch.product_image;
            if (!image) {
                image = "http://placehold.it/150";
            } else {

                const ext = image.split('.').pop();
                if (!ext) {
                    image = "http://placehold.it/150";
                } else {
                    image = "http://localhost:4000/" + image;
                }
            }

            /*  if (qty <= 3) {
               const  qty = `<span id="${productid}"><button class='btn btn-round btn-outline-danger'>${qty}</button><span>`
             } else {
                const qty = `<span id="${productid}"><button class='btn btn-round btn-outline-success'>${qty}</button></span>`
             } */

            const username = fetch.added_by;
            const product_status = fetch.product_type;
            const sale_price = fetch.product_sale_price;
            const regular_price = fetch.product_regular_price;

            const disable_date1 = fetch.disable_date;
            let disable_date = '';

            if (disable_date1 !== null && disable_date1 !== undefined) {
                const disable_date = disable_date1.toISOString().slice(0, 10);
            }


            const meta_title = fetch.product_meta_title;
            const meta_keyword = fetch.product_meta_keyword;
            const meta_description = fetch.product_meta_description;
            const note = fetch.note;

            const date1 = fetch.product_date;
            const date = date1.toISOString().slice(0, 10);

            const pushdate1 = fetch.push_to_top_date;
            const pushdate = pushdate1.toISOString().slice(0, 10);

            let category_names = [];
            const sql1 = await relationMaster.find({ product_id: productid, type: 'cat' })

            for (const fetch1 of sql1) {
                const cat_id = fetch1.type_id
                const sql2 = await Category.find({ _id: cat_id })

                for (const fetch2 of sql2) {
                    // category_name = fetch2.category_name
                    category_names.push(fetch2.category_name)
                }
            }

            let subcategory_names = [];
            const sql3 = await relationMaster.find({ product_id: productid, type: 'subcat' })

            for (const fetch3 of sql3) {
                const subcat_id = fetch3.type_id
                const sql4 = await SubCategory.find({ _id: subcat_id })
                for (const fetch4 of sql4) {
                    // subcategory_name = fetch4.subcategory_name
                    subcategory_names.push(fetch4.subcategory_name);
                }
            }

            num++;

            const data1 = {
                product_id: productid,
                image: image,
                username: username,
                name: name,
                product_status: product_status,
                stock: qty,
                disable_date: disable_date,
                price: sale_price,
                pcs: pcs,
                sku: sku,
                category: category_names,
                subcategory: subcategory_names,
                note: note,
                date: date,
                pushdate: pushdate,
            };

            data_product.push(data1);

        }
        const results = {
            sEcho: 1,
            iTotalRecords: data_product.length,
            iTotalDisplayRecords: data_product.length,
            aaData: data_product,
        };

        res.render("product_view", { view_product: data_product })

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }

}


const deleteproduct = async (req, res) => {
    try {

        const productId = req.params.id.split(',').map(id => new mongoose.Types.ObjectId(id.trim()));
        const productsToDelete = await Product.find({ _id: { $in: productId } });

        for (const product of productsToDelete) {
            const absolutePath = path.join(__dirname, '../public', product.product_image);
            fs.unlink(absolutePath, (err) => {
                if (err) {
                    console.error(`Error removing file: ${err}`);
                    return;
                }
            })
        }

        const subimagesDelete = await productSubimage.find({ product_id: { $in: productId } })
        if (subimagesDelete.length > 0) {
            for (const subimages of subimagesDelete) {
                const absolutePath1 = path.join(__dirname, '../public', subimages.subimage);
                fs.unlink(absolutePath1, (err) => {
                    if (err) {
                        console.error(`Error removing file: ${err}`);
                        return;
                    }
                })
            }
        }

        const result = await Product.deleteMany({ _id: { $in: productId } });
        const result1 = await SizerelationMaster.deleteMany({ product_id: { $in: productId } });
        const result2 = await brandRelation.deleteMany({ product_id: { $in: productId } });
        const result3 = await productSubimage.deleteMany({ product_id: { $in: productId } });
        const result4 = await relationMaster.deleteMany({ product_id: { $in: productId } });

        if (result) {
            res.send("ok")
        } else {
            res.status(500).send("Failed to delete products");
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

const outofstockproduct = async (req, res) => {
    const exportId = req.params.id.split(',');

    const product_qty = '0';
    const updateFields = { product_qty };

    try {
        // Update all documents where _id is in catalog_ids array
        const updatedProducts = await Product.updateMany(
            { _id: { $in: exportId.map(id => new mongoose.Types.ObjectId(id)) } },
            { $set: updateFields }
        );

        res.send("ok");
    } catch (error) {
        console.error("Error updating products:", error);
        res.status(500).send("Error updating products");
    }

}

module.exports = {
    getproductInfo,
    deleteproduct,
    outofstockproduct,

}