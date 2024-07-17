const express = require('express');
const router = express.Router();
const Controllerport = require('../controllers/portfolio');
const Controllerproduct = require('../controllers/product1');
const Controllercart = require('../controllers/cart');
const Controllercheckout = require('../controllers/checkout.js');
const Controllerwishlist = require('../controllers/wishlist');
const Controllerabout = require('../controllers/aboutus.js');
const Controllertrackorder = require('../controllers/track.js');
const Controllercontactus = require('../controllers/contactus.js');
const Controllershipping_policy = require('../controllers/shipping-policy.js');
const Controllerprivacy_policy = require('../controllers/privacy-policy.js');
const Controllerexchange_policy = require('../controllers/exchange-policy.js');

 router.get('/portfolio', Controllerport.getportfolioInfo);
 router.get('/product', Controllerproduct.getportproductInfo);
 router.get('/cart', Controllercart.getcartInfo);
 router.get('/checkout', Controllercheckout.getcheckoutInfo);
 router.get('/wishlist', Controllerwishlist.getwishlistInfo);
 router.get('/aboutus', Controllerabout.getaboutInfo);
 router.get('/TRACK_ORDER', Controllertrackorder.gettrackorderInfo);
 router.get('/contactus', Controllercontactus.getcontactusInfo);
 router.get('/shipping-policy', Controllershipping_policy.getshipping_policyInfo);
 router.get('/privacy-policy', Controllerprivacy_policy.getprivacy_policyInfo);
 router.get('/exchange-policy', Controllerexchange_policy.getexchange_policyInfo);
//  router.post('/portfolio', Controller.updateportfolio)


module.exports = router;