const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SubCategory = require("../models/subcategory");
const Category = require("../models/category");
const Brand = require("../models/brand");
const Size = require("../models/size")
const product_master = require("../models/product");
const brandRelationMaster = require("../models/brand_relation_master")
const relationMaster = require("../models/relation_master")
const sizerelationMaster = require("../models/size_relation_master")
const productSubimage = require("../models/product_subimage")

const getproductInfo = async (req, res) => {
    try {
        const productId = req.body.product_id;
        console.log("productId",productId);
        const sql_product = await product_master.findOne({ _id: productId })

        const date = new Date(sql_product.disable_date);
        const disableDate = format(date, 'yyyy-MM-dd');

        const pushtotopdate = new Date(sql_product.push_to_top_date);
        const pushtotopDate = format(pushtotopdate, 'yyyy-MM-dd');

        const sql_subimage = await productSubimage.find({ product_id: productId, subimage_type: 'catalog' })

        const category = await Category.find();

        const sql_relation_cat = await relationMaster.find({ product_id: productId, type: 'cat' })

        const typeIds = sql_relation_cat.map(doc => doc.type_id);

        const sql_relation_subcat = await relationMaster.find({ product_id: productId, type: 'subcat' })
        const subtypeIds = sql_relation_subcat.map(doc => doc.type_id);
        const brand = await Brand.find({ brand_hide: 0 }).sort({ brand_name: 1 })

        const sql_brand_relation = await brandRelationMaster.find({ product_id: productId, brand_type: 'catalog' })

        const brandIds = sql_brand_relation.map(doc => doc.brand_id.toString());

        const size = await Size.find({ size_hide: 0 }).sort({ _id: 1 })

        const sql_size_relation = await sizerelationMaster.find({ product_id: productId, size_type: 'catalog' })

        const totalsize = sql_size_relation.length + 1;

        let num = 1;

        sql_size_relation.forEach(doc => {
            doc.num = num++
            doc.sizes = size;
        });

        count_rows = sql_subimage.length + 1;
        sql_subimage.forEach(image => {
            image.subimage = image.subimage.replace(/\\/g, '/');
        });

        res.render("product_view", {
            sql_product,
            sql_subimage,
            sql_relation_cat,
            sql_relation_subcat,
            sql_brand_relation,
            size,
            sql_size_relation,
            category,
            brand,
            count_rows,
            typeIds,
            subtypeIds,
            disableDate,
            pushtotopDate,
            brandIds,
            totalsize,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

const quickupdateproduct = async (req,res)=>{
    const productId = req.params.id;
    console.log("productId",productId);
    res.send("Connect Successfully...44646464")
}

module.exports = {
    getproductInfo,
    quickupdateproduct,
}