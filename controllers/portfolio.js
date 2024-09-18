const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Category = require("../models/category");

const getportfolioInfo = async (req, res) => {
const id = req.params.id;
const catdata = await Category.find({category_seo_url:id})

    res.render("web/views/portfolio",{catdata})
}

module.exports = {
    getportfolioInfo,

}