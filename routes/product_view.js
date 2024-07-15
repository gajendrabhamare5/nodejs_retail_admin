const express = require('express');
const router = express.Router();
const productviewController = require('../controllers/productview');

 router.get('/product_view', productviewController.getproductInfo);
 router.post('/product_delete/:id', productviewController.deleteproduct);
 router.post('/out_of_stock_process/:id', productviewController.outofstockproduct);
/*  router.post('/get_subcat_from_cat/:id', productController.getsubcat);
 router.post('/check_repeat_product', productController.checkrepeatproduct);
 router.post('/product_add', productController.productadd); */


module.exports = router;