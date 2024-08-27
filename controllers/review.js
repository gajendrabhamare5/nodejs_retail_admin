const Product = require("../models/product");
const Review = require("../models/review");

const getadminreview = async (req,res)=>{
    const sql_data = await Product.find();
    // console.log("sql_data",sql_data);
res.render("retail_admin/views/review_product",{sql_data});
}

const addadminreview = async (req,res) =>{
    const {pro_id,cust_name,cust_review,star_review,} = req.body;
    const image = req.files;

    const fetch_user = await Review.find();
    


}

module.exports = {
    getadminreview,
    addadminreview,
}