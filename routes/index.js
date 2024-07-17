const express = require('express');
const router = express.Router();
const Controllerport = require('../controllers/portfolio');
const Controllerproduct = require('../controllers/product1');

 router.get('/portfolio', Controllerport.getportfolioInfo);
 router.get('/product', Controllerproduct.getportproductInfo);
//  router.post('/portfolio', Controller.updateportfolio)


module.exports = router;