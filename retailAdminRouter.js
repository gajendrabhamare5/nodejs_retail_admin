// retailAdminRouter.js
const express = require('express');
const router = express.Router();

// Import all routes
const categoryRoutes = require('./routes/category');
const subcategoryRoutes = require('./routes/subcategory');
const seoRoutes = require('./routes/home_seo');
const sliderRoutes = require('./routes/slider');
const mobnumberRoutes = require('./routes/contact_number');
const marqueeRoutes = require('./routes/marquee');
const brandRoutes = require('./routes/brand');
const sizeRoutes = require('./routes/size');
const productRoutes = require('./routes/product');
const attributeRoutes = require('./routes/attribute');
const subattributeRoutes = require('./routes/subattribute');
const productviewRoutes = require('./routes/product_view');
const producteditRoutes = require('./routes/product_edit');

// Use routes with /retail_admin prefix
router.use('/category', categoryRoutes);
router.use('/subcategory', subcategoryRoutes);
router.use('/home_seo', seoRoutes);
router.use('/slider', sliderRoutes);
router.use('/contact_number', mobnumberRoutes);
router.use('/marquee', marqueeRoutes);
router.use('/brand', brandRoutes);
router.use('/size', sizeRoutes);
router.use('/product', productRoutes);
router.use('/attribute', attributeRoutes);
router.use('/subattribute', subattributeRoutes);
router.use('/product_view', productviewRoutes);
router.use('/product_edit', producteditRoutes);

module.exports = router;
