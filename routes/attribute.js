const express = require('express');
const router = express.Router();
const attributeController = require('../controllers/attribute.js');

 router.get('/attribute', attributeController.getattribute);
 router.post('/attribute_add_process', attributeController.addattribute);
 router.post('/attribute_delete/:id', attributeController.deleteattribute);
 router.get('/attribute_edit/:id', attributeController.attributegetinfo);
 router.post('/attribute_edit_process', attributeController.attributeupdate);

module.exports = router;