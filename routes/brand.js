const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand');

 router.get('/brand_add', brandController.getbrand);
 router.get('/brand_delete/:id', brandController.deletebrand);
 router.get('/brand_hide/:id', brandController.brandHide)
 router.get('/brand_edit/:id', brandController.brandEditInfo)
 router.post('/brand_add', brandController.insertbrand)
 router.post('/brand_edit/:id', brandController.updatebrand)

module.exports = router;
