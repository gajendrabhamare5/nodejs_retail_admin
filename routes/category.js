const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

 router.get('/category', categoryController.getCategory);
 router.get('/category_hide/:id', categoryController.catgoryHide)
 router.get('/category_delete/:id', categoryController.catgoryDelete)
 router.get('/category_edit/:id', categoryController.catgoryEditInfo)
router.post('/category_edit/:id', categoryController.updatecatgory)
router.post('/category', categoryController.createCategory);

module.exports = router;

