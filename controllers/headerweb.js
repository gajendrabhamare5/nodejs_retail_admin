const Category = require("../models/category.js")

const getheaderInfo = async (req, res) => {

res.render("web/views/index");
}

module.exports = {
    getheaderInfo,

}