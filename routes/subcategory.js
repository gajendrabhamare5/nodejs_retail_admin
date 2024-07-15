const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategory');

 router.get('/subcategory_add', subcategoryController.getSubCategory);
 router.post('/subcategory_add', subcategoryController.createSubCategory);
 router.get('/subcategory_delete/:id', subcategoryController.subcatgoryDelete)
 router.get('/subcategory_edit/:id', subcategoryController.subcatgoryEditInfo)
 router.post('/subcategory_edit/:id', subcategoryController.updatesubcatgory)
/*  router.get('/category_hide/:id', categoryController.catgoryHide)
  */

module.exports = router;

