const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Category = require("../models/category");
const SubCategory = require("../models/subcategory");
const product_master = require("../models/product");
const relationMaster = require("../models/relation_master")
const Size = require("../models/size")
const sizerelationMaster = require("../models/size_relation_master")

const getportfolioInfo = async (req, res) => {
    const id = req.params.id;
    let categoryDetails = {};
    const categoryData = await Category.find({ category_seo_url: id })

    if (categoryData.length) {
        categoryDetails = {
            id: categoryData[0].category_id,
            var_catagory_nama: categoryData[0].category_name,
            banner: categoryData[0].category_banner,
            image: categoryData[0].category_image,
            meta_title: categoryData[0].category_meta_title,
            other_details: categoryData[0].other_details,
            meta_keyword: categoryData[0].category_meta_keyword,
            meta_desc: categoryData[0].category_meta_description,
            mobile: categoryData[0].cat_mobile,
            type: 'cat',
        };
    } else {

        const subCategoryData = await SubCategory.find({ subcategory_seo_url: id }).populate('category_id');

        if (subCategoryData.length) {

            categoryDetails = {
                id: subCategoryData[0]._id,
                cateid: subCategoryData[0].category_id ? subCategoryData[0].category_id : null,
                meta_title1: subCategoryData[0].subcategory_meta_title,
                meta_keyword1: subCategoryData[0].subcategory_meta_keyword,
                cat_other_detail: subCategoryData[0].other_details,
                meta_desc1: subCategoryData[0].subcategory_meta_description,
                var_catagory_nama: subCategoryData[0].subcategory_name,
                var_catagory_mobile: subCategoryData[0].subcat_mobile,
                type: 'subcat',
            }

        } else if (id != 'all_new_arrival' || id != 'Sale') {

        }
    }
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const record_per_page = 20;
    const start_page = ((page - 1)) * (record_per_page);

    if (id == 'all_new_arrival') {
        const aggregateQuery = [
            {
                $match: {
                    product_sale_price: { $ne: 0 }, // product_sale_price != 0
                    product_status: { $ne: 'draft' } // LOWER(product_status) != 'draft'
                }
            },
            {
                $group: {
                    _id: null, // Grouping all documents into a single group
                    min: { $min: "$product_sale_price" }, // Calculate minimum price
                    max: { $max: "$product_sale_price" }  // Calculate maximum price
                }
            },
            {
                $sort: { product_date: -1 } // Sort by product_date in descending order (note: this may not affect the grouping)
            }
        ];

        // Execute the query
        const result = await product_master.aggregate(aggregateQuery);
       

    } else if (id == 'Sale') {
        const aggregation = [
            {
                $match: {
                    product_sale_price: { $ne: 0 }, // product_sale_price != 0
                    upcoming: 1,
                }
            },
            {
                $group: {
                    _id: null, // Grouping all documents into a single group
                    min: { $min: "$product_sale_price" }, // Calculate minimum price
                    max: { $max: "$product_sale_price" }  // Calculate maximum price
                }
            },
            {
                $sort: { product_date: -1 } // Sort by product_date in descending order (note: this may not affect the grouping)
            }
        ];
        const result = await product_master.aggregate(aggregation);
    }

    const sizes = await Size.find({ size_hide: 0 }, { size_id: 1, size_name: 1 });
    const size_id_array = sizes.map(size => size.size_id);
    const size_name_array = sizes.map(size => size.size_name);

    res.render("web/views/portfolio", { categoryDetails })
}

module.exports = {
    getportfolioInfo,

}