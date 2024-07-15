const express = require('express');
const router = express.Router();
const marqueeController = require('../controllers/marquee');

 router.get('/marquee', marqueeController.getmarqueeInfo);
  router.post('/marquee', marqueeController.updatemarquee)

module.exports = router;