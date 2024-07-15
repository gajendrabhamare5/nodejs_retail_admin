const express = require('express');
const router = express.Router();
const cnumberController = require('../controllers/contact_number');

 router.get('/contact_number', cnumberController.getcnumberInfo);
 router.post('/contact_number', cnumberController.updatecnumber)

module.exports = router;