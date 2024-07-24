
const Category = require('../models/category.js');
const Subcategory = require('../models/subcategory.js');

async function injectCommonData(req, res, next) {
    try {

        const category_data = await Category.find({
            category_hide: 0,
            category_delete: 0
        }).sort('category_sort');



        const categoriesWithSubcategories = [];
        for (const category of category_data) {
            let categoryId = category._id;

            const subcategories = await Subcategory.find({
                category_id: categoryId
            }).sort('subcategory_sort');

            categoriesWithSubcategories.push({
                ...category.toObject(),
                subcategories
            });
        }

        category.subcategories = subcategories;

        res.locals.category_data = category_data;

    } catch (error) {
        console.error('Error fetching common data:', error);
        res.locals.category_data = [];
    }

    next(); // Proceed to the next middleware or route handler
}

module.exports = injectCommonData;
