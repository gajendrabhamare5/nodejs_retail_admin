const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    product_sku: {
        type: String,
        /* require:true, */
    },
    product_hsn: {
        type: String,

    },
    parent_sku: {
        type: String,
        default: null
    },

    product_name: {
        type: String,
    },
    cname: {
        type: String,

    },
    product_seo_url: {
        type: String,

    },
    product_image: {
        type: String,

    },
    product_qty:
    {
        type: String,
    },
    catalog_pcs:
    {
        type: String,
    },
    product_price:
    {
        type: Number,
    },
    product_mrp_price:
    {
        type: String,
    },
    product_sale_price:
    {
        type: String,
    },
    product_reseller_price:
    {
        type: String,
    },
    product_reseller_sale_price:
    {
        type: String,
    },
    product_reseller_mrp_price:
    {
        type: String,
    },
    product_gst:
    {
        type: String,
    },
    product_weight:
    {
        type: String,
    },
    product_stitch:
    {
        type: String,
    },
    catalog_type:
    {
        type: String,
    },
    moq:
    {
        type: String,
    },
    top_fabric:
    {
        type: String,
    },
    bottom_fabric:
    {
        type: String,
    },
    dupatta_fabric:
    {
        type: String,
    },
    saree_fabric:
    {
        type: String,
    },
    blouse_fabric:
    {
        type: String,
    },
    lehenga_fabric:
    {
        type: String,
    },
    inner_for:
    {
        type: String,
    },
    color:
    {
        type: String,
    },
    bottom:
    {
        type: String,
    },
    length:
    {
        type: String,
    },
    accessories_length:
    {
        type: String,
    },
    product_short_description:
    {
        type: String,
    },
    product_full_description:
    {
        type: String,
    },
    product_status:
    {
        type: String,
    },
    product_meta_title:
    {
        type: String,
    },
    product_meta_keyword:
    {
        type: String,
    },
    product_meta_description:
    {
        type: String,
    },
    disable_date:
    {
        type: Date,
        default: Date.now,
    },
    upcoming:
    {
        type: String,
    },
    product_type:
    {
        type: String,
    },
    video_link:
    {
        type: String,
    },
    other_detail:
    {
        type: String,
    },
    single_catalog:
    {
        type: String,
    },
    product_date:
    {
        type: Date,
        default: Date.now,
    },
    push_to_top_date:
    {
        type: Date,
        default: Date.now,
    },
    added_by:
    {
        type: String,

    },
    delivery_date:
    {
        type: Date,
        default: Date.now,
    },
    fabric:
    {
        type: String,

    },
    availability:
    {
        type: String,

    },
    permalink:
    {
        type: String,

    },
    filter:
    {
        type: String,

    },
    note:
    {
        type: String,

    },

})

const product_master = new mongoose.model("product_master", productSchema);

module.exports = product_master