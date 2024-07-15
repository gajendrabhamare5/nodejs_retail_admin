const express = require('express');
const router = express.Router();
const seoController = require('../controllers/home_seo');

 router.get('/home_seo', seoController.getSeoInfo);
 router.post('/home_seo', seoController.updateSeo)


module.exports = router;

