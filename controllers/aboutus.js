const about = require("../models/aboutus");

const getaboutInfo = async (req, res) => {

    const sql_data = await about.findOne();
    // console.log("sql",sql_data);

    res.render("aboutus",{ sql_data });
}

module.exports = {
    getaboutInfo,

}