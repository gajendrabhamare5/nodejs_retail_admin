const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

 router.get('/product_add', productController.getproductInfo);
 router.post('/get_subcat_from_cat/:id', productController.getsubcat);
 router.post('/check_repeat_product', productController.checkrepeatproduct);
 router.post('/product_add', productController.productadd);

module.exports = router;