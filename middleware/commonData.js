
const Category = require('../models/category.js');
const Subcategory = require('../models/subcategory.js');
const Announcement = require('../models/announcement.js');

async function injectCommonData(req, res, next) {
  try {

    const category_data = await Category.find({
      category_hide: 0,
      category_delete: 0
    }).sort('category_sort').lean();

    for (const category of category_data) {

      let categoryId = category._id;

      const subcategories = await Subcategory.find({
        category_id: categoryId
      }).sort('subcategory_sort');

      //index = category_data.findIndex(x => x._id ==  categoryId);

      // if(categoryId == '669f33387fce56c0bbb5035a'){
       /*  console.log("INDEXX"+category_data[index])
        console.log(typeof category_data[index]) */
      // }
      // var categoryObj = category_data[index];
      // console.log("OBJJ"+categoryObj)
      // categoryObj.subcategory_data = "njknkjn";
      // console.log("OBJJ"+categoryObj)
      //category_data[index].subcategories = subcategories;
      // category['subcategories'] = subcategories;

    //   const subcategoryCount = subcategories.length;
       category.subcategories = subcategories;
     }

     // const subcat_data = await Subcategory.find();

     const announcement = await Announcement.findOne();

    res.locals.category_data = category_data;
    res.locals.announcement = announcement;

  } catch (error) {
    console.error('Error fetching common data:', error);
    res.locals.category_data = [];
    res.locals.announcement = [];

  }

  next();
}

module.exports = injectCommonData;
