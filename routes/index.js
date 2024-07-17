const express = require('express');
const router = express.Router();
const Controllerport = require('../controllers/portfolio');
const Controllerproduct = require('../controllers/product1');
const Controllercart = require('../controllers/cart');
const Controllercheckout = require('../controllers/checkout.js');
const Controllerwishlist = require('../controllers/wishlist');

 router.get('/portfolio', Controllerport.getportfolioInfo);
 router.get('/product', Controllerproduct.getportproductInfo);
 router.get('/cart', Controllercart.getcartInfo);
 router.get('/checkout', Controllercheckout.getcheckoutInfo);
 router.get('/wishlist', Controllerwishlist.getwishlistInfo);
//  router.post('/portfolio', Controller.updateportfolio)


module.exports = router;