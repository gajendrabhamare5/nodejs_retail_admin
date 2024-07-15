const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/slider_add');



 router.get('/slider_add', sliderController.getSlider);
 router.post('/slider_add', sliderController.insertSlider);
 router.get('/slider_delete/:id', sliderController.sliderDelete)
 router.get('/slider_edit/:id', sliderController.sliderEditInfo)
router.post('/slider_edit/:id', sliderController.updateSlider)
module.exports = router;
