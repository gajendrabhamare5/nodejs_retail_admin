const express = require('express');
const router = express.Router();
const Controllerport = require('../controllers/portfolio.js');
const Controllerproduct = require('../controllers/product1.js');
const Controllercart = require('../controllers/cart.js');
const Controllercheckout = require('../controllers/checkout.js');
const Controllerwishlist = require('../controllers/wishlist.js');
const Controllerabout = require('../controllers/aboutus.js');
const Controllertrackorder = require('../controllers/track.js');
const Controllercontactus = require('../controllers/contactus.js');
const Controllershipping_policy = require('../controllers/shipping-policy.js');
const Controllerprivacy_policy = require('../controllers/privacy-policy.js');
const Controllerexchange_policy = require('../controllers/exchange-policy.js');
const Controllerterms_condition = require('../controllers/terms_condition.js');
const Controllerfaq = require('../controllers/faq.js');
const Controllersubscribe = require('../controllers/subscribe.js');
const Controllerheader = require('../controllers/headerweb.js');

//retail admin controller called
const categoryController = require('../controllers/category.js');
const subcategoryController = require('../controllers/subcategory.js');
const seoController = require('../controllers/home_seo.js');
const sliderController = require('../controllers/slider_add.js');
const cnumberController = require('../controllers/contact_number.js');
const marqueeController = require('../controllers/marquee.js');
const brandController = require('../controllers/brand.js');
const sizeController = require('../controllers/size.js');
const productController = require('../controllers/product.js');
const attributeController = require('../controllers/attribute.js');
const subattributeController = require('../controllers/subattribute.js');
const productviewController = require('../controllers/productview.js');
const producteditController = require('../controllers/product_edit.js');
const inquiryController = require('../controllers/inquiry.js');
const Controllerprivacy = require('../controllers/privacy-policy.js');
const Controllershipping = require('../controllers/shipping-policy.js');
const Controllerterms = require('../controllers/terms_condition.js');
const Controllerfaqs = require('../controllers/faq.js');
const Controllerexchange = require('../controllers/exchange-policy.js');
const Controllercod = require('../controllers/cod_charge.js');
const Controllerannouncement = require('../controllers/announcement.js');
const Controllerseason = require('../controllers/seasonstore.js');
const Controllerreview = require('../controllers/review.js');
const Controllersubscribers = require('../controllers/subscribe.js');



//web routes called

router.get('/', Controllerheader.getheaderInfo);
router.get('/portfolio', Controllerport.getportfolioInfo);
router.get('/product', Controllerproduct.getportproductInfo);
// router.get('/cart', Controllercart.getcartInfo);
router.get('/checkout', Controllercheckout.getcheckoutInfo);
router.get('/wishlist', Controllerwishlist.getwishlistInfo);
router.get('/aboutus', Controllerabout.getaboutInfo);
router.get('/track-order', Controllertrackorder.gettrackorderInfo);

router.post('/subscribe_process', Controllersubscribe.insertsubscribers)

router.get('/contact-us', Controllercontactus.getcontactusInfo);
router.post('/contact-us', Controllercontactus.insertcontactusInfo);

router.post('/contact-us', Controllercontactus.insertcontactusInfo);
router.get('/shipping-policy', Controllershipping_policy.getshipping_policyInfo);
router.get('/privacy-policy', Controllerprivacy_policy.getprivacy_policyInfo);
//  router.post('/privacy-policy', Controllerprivacy_policy.insertInfo);
router.get('/return-exchange', Controllerexchange_policy.getexchange_policyInfo);
router.get('/terms-condition', Controllerterms_condition.getterms_conditionInfo);
router.get('/faq', Controllerfaq.getfaqInfo);
//  router.post('/portfolio', Controller.updateportfolio)


//retail_admin Routes called
router.get('/retail_admin/category', categoryController.getCategory);
router.get('/retail_admin/category_hide/:id', categoryController.catgoryHide)
router.get('/retail_admin/category_delete/:id', categoryController.catgoryDelete)
router.get('/retail_admin/category_edit/:id', categoryController.catgoryEditInfo)
router.post('/retail_admin/category_edit/:id', categoryController.updatecatgory)
router.post('/retail_admin/category', categoryController.createCategory);

router.get('/retail_admin/subcategory_add', subcategoryController.getSubCategory);
router.post('/retail_admin/subcategory_add', subcategoryController.createSubCategory);
router.get('/retail_admin/subcategory_delete/:id', subcategoryController.subcatgoryDelete)
router.get('/retail_admin/subcategory_edit/:id', subcategoryController.subcatgoryEditInfo)
router.post('/retail_admin/subcategory_edit/:id', subcategoryController.updatesubcatgory)

router.get('/retail_admin/home_seo', seoController.getSeoInfo);
router.post('/retail_admin/home_seo', seoController.updateSeo)

router.get('/retail_admin/slider_add', sliderController.getSlider);
router.post('/retail_admin/slider_add', sliderController.insertSlider);
router.get('/retail_admin/slider_delete/:id', sliderController.sliderDelete)
router.get('/retail_admin/slider_edit/:id', sliderController.sliderEditInfo)
router.post('/retail_admin/slider_edit/:id', sliderController.updateSlider)

router.get('/retail_admin/contact_number', cnumberController.getcnumberInfo);
router.post('/retail_admin/contact_number', cnumberController.updatecnumber)

router.get('/retail_admin/marquee', marqueeController.getmarqueeInfo);
router.post('/retail_admin/marquee', marqueeController.updatemarquee)

router.get('/retail_admin/brand_add', brandController.getbrand);
router.get('/retail_admin/brand_delete/:id', brandController.deletebrand);
router.get('/retail_admin/brand_hide/:id', brandController.brandHide)
router.get('/retail_admin/brand_edit/:id', brandController.brandEditInfo)
router.post('/retail_admin/brand_add', brandController.insertbrand)
router.post('/retail_admin/brand_edit/:id', brandController.updatebrand)

router.get('/retail_admin/size_add', sizeController.getsizeInfo);
router.get('/retail_admin/size_hide/:id', sizeController.hidesize);
router.get('/retail_admin/size_edit/:id', sizeController.getsizeeditInfo);
router.post('/retail_admin/size_add', sizeController.insertsize);
router.post('/retail_admin/size_edit/:id', sizeController.updatesize);

router.get('/retail_admin/product_add', productController.getproductInfo);
router.post('/retail_admin/get_subcat_from_cat/:id', productController.getsubcat);
router.post('/retail_admin/check_repeat_product', productController.checkrepeatproduct);
router.post('/retail_admin/product_add', productController.productadd);

router.get('/retail_admin/attribute', attributeController.getattribute);
router.post('/retail_admin/attribute_add_process', attributeController.addattribute);
router.post('/retail_admin/attribute_delete/:id', attributeController.deleteattribute);
router.get('/retail_admin/attribute_edit/:id', attributeController.attributegetinfo);
router.post('/retail_admin/attribute_edit_process', attributeController.attributeupdate);

router.get('/retail_admin/sub_attribute', subattributeController.getsubattribute);
router.post('/retail_admin/sub_attribute_add_process', subattributeController.addSubattribute);
router.post('/retail_admin/sub_attribute_delete/:id', subattributeController.deletesubattribute);
router.get('/retail_admin/subattribute_edit/:id', subattributeController.subattributegetinfo);
router.post('/retail_admin/subattribute_edit_process', subattributeController.subattributeupdate);
router.post('/retail_admin/subattribute_pop_process', subattributeController.subattributepop);
router.post('/retail_admin/product_attribute', subattributeController.proattribute);

router.get('/retail_admin/product_view', productviewController.getproductInfo);
router.post('/retail_admin/product_delete/:id', productviewController.deleteproduct);
router.post('/retail_admin/out_of_stock_process/:id', productviewController.outofstockproduct);

router.get('/retail_admin/product_edit/:id', producteditController.getproductpage);
router.post('/retail_admin/product_edit/:id', producteditController.updateproduct);
router.get('/retail_admin/product_edit_detail_fetch', producteditController.quickproduct);
router.post('/retail_admin/product_edit_detail_fetch/:id', producteditController.quickproduct1);
router.post('/retail_admin/product_quick_edit_process', producteditController.quickproductupdate);


router.get('/retail_admin/inquiry_list', inquiryController.getinquiryinfo);
router.post('/retail_admin/inquiry_delete/:id', inquiryController.deleteinquiry);

router.get('/retail_admin/about_us', Controllerabout.getadminaboutinfo);
router.post('/retail_admin/about_us_add_process', Controllerabout.addadminaboutinfo);

router.get('/retail_admin/privacy_policy', Controllerprivacy.getadminprivacy_policy);
router.post('/retail_admin/privacy_policy_update', Controllerprivacy.addadminprivacy_policy);

router.get('/retail_admin/shipping_policy', Controllershipping.getadminshipping_policy);
router.post('/retail_admin/shipping_policy_update', Controllershipping.addadminshipping_policy);

router.get('/retail_admin/terms', Controllerterms.getadminterms);
router.post('/retail_admin/terms_update', Controllerterms.addadminterms);

router.get('/retail_admin/faqs', Controllerfaqs.getadminfaq);
router.post('/retail_admin/faq_update', Controllerfaqs.addadminfaq);

router.get('/retail_admin/refund_policy', Controllerexchange.getadminrefund);
router.post('/retail_admin/refund_policy_update', Controllerexchange.addadminrefund);

router.get('/retail_admin/update_cod_charge',Controllercod.getadmincodcharge)
router.post('/retail_admin/update_cod_charge_process',Controllercod.addadmincodcharge)

router.get('/retail_admin/announcement_slider',Controllerannouncement.getadminannouncement)
router.post('/retail_admin/announcement_slider_update',Controllerannouncement.addadminannouncement)

router.get('/retail_admin/season_store_add',Controllerseason.getadminseason)
router.post('/retail_admin/season_store_add_process',Controllerseason.addadminseason)
router.post('/retail_admin/season_store_edit_process',Controllerseason.editadminseason)
router.post('/retail_admin/season_store_delete/:id',Controllerseason.deleteadminseason)

router.get('/retail_admin/review_product',Controllerreview.getadminreview)
router.post('/retail_admin/review_rating_add_process',Controllerreview.addadminreview)
router.get('/retail_admin/review_edit/:id', Controllerreview.reviewEditInfo)
router.post('/retail_admin/review_rating_edit_process', Controllerreview.updatereview)
router.post('/retail_admin/review_rating_delete/:id', Controllerreview.deletereview)

router.get('/retail_admin/subscribers_list',Controllersubscribers.getadmin)
module.exports = router;