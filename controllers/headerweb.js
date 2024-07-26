const Category = require("../models/category.js")
const Review = require("../models/review.js")
const Slider = require("../models/slider_add.js")
const SeasonStore = require("../models/seasonstore.js")
const Video = require("../models/video.js")
const product = require("../models/product.js")

const getheaderInfo = async (req, res) => {

    const review = await Review.find();
    const slider = await Slider.find();
    const seasonStore = await SeasonStore.find({ slider_image: { $ne: '' } }, null,{ sort: { slider_id: -1 }, limit: 8 });
    const video = await Video.find().sort({ category_id: -1 }).limit(4).exec();

    // const query = { product_status: 'Publish',parent_sku: '' };
    const products = await product.find({product_status: 'Publish'}).sort({ product_id: -1, cat_date: -1 }).limit(4);

    console.log("products",products);

res.render("web/views/index",{review,slider,seasonStore,video,products});
}

module.exports = {
    getheaderInfo,

}