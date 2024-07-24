
const Category = require('../models/category.js');

async function injectCommonData(req, res, next) {
  try {
    const category_data = await Category.find({
      category_hide: 0,
      category_delete: 0
    }).sort('category_sort');

        

    res.locals.category_data = category_data;
  } catch (error) {
    console.error('Error fetching common data:', error);
    res.locals.category_data = []; // Default to an empty array if there's an error
  }

  next(); // Proceed to the next middleware or route handler
}

module.exports = injectCommonData;
