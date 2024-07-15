const express = require('express');
const router = express.Router();
const subattributeController = require('../controllers/subattribute.js');

router.get('/sub_attribute', subattributeController.getsubattribute);
router.post('/sub_attribute_add_process', subattributeController.addSubattribute);
router.post('/sub_attribute_delete/:id', subattributeController.deletesubattribute);
router.get('/subattribute_edit/:id', subattributeController.subattributegetinfo);
router.post('/subattribute_edit_process', subattributeController.subattributeupdate);
router.post('/subattribute_pop_process', subattributeController.subattributepop);
router.post('/product_attribute', subattributeController.proattribute);

module.exports = router;