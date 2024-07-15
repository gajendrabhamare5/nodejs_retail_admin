const express = require('express');
const router = express.Router();
const sizeController = require('../controllers/size');

 router.get('/size_add', sizeController.getsizeInfo);
 router.get('/size_hide/:id', sizeController.hidesize);
 router.get('/size_edit/:id', sizeController.getsizeeditInfo);
 router.post('/size_add', sizeController.insertsize);
 router.post('/size_edit/:id', sizeController.updatesize);

module.exports = router;