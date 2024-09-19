const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Category = require("../models/category");
const SubCategory = require("../models/subcategory");
const product_master = require("../models/product");
const relationMaster = require("../models/relation_master")
const Size = require("../models/size")
const sizerelationMaster = require("../models/size_relation_master")

const getportproductInfo = async (req, res) => {
    const id = req.params.id;
    const pro_data = await product_master.find({product_seo_url:id});

    res.render("web/views/product",{pro_data})
}

module.exports = {
    getportproductInfo,

}