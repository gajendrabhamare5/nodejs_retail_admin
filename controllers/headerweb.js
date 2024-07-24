const Category = require("../models/category.js")

const getheaderInfo = async (req, res) => {

const category_data = await Category.find({
    category_hide:0,
    category_delete:0,
    }).sort('category_sort');

//console.log("category_data",category_data);


res.render("web/views/index",{category_data});
}

module.exports = {
    getheaderInfo,

}