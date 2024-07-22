const express = require('express');
const router = express.Router();
const seoController = require('../controllers/home_seo');

 router.get('/retail_admin/home_seo', seoController.getSeoInfo);
 router.post('/retail_admin/home_seo', seoController.updateSeo)


module.exports = router;

