const express = require('express');
const router = express.Router();
const producteditdetailController = require('../controllers/product_edit_detail_fetch');

 router.get('/product_edit_detail_fetch', producteditdetailController.getproductInfo);
router.post('/product_edit_detail_fetch/:id', producteditdetailController.quickupdateproduct)

module.exports = router;