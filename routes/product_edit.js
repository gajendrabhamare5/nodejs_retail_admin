const express = require('express');
const router = express.Router();
const producteditController = require('../controllers/product_edit.js');

router.get('/product_edit/:id', producteditController.getproductpage);
router.post('/product_edit/:id', producteditController.updateproduct);
router.get('/product_edit_detail_fetch', producteditController.quickproduct);
router.post('/product_edit_detail_fetch/:id', producteditController.quickproduct1);
router.post('/product_quick_edit_process', producteditController.quickproductupdate);

module.exports = router;