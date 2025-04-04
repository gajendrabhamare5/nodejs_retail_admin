const express = require('express');
const router = express.Router();

const Controllerport = require('../controllers/portfolio.js');
const Controllerproduct = require('../controllers/product1.js');
// const Controllercart = require('../controllers/cart.js');
const Controllercheckout = require('../controllers/checkout.js');
const Controllerwishlist = require('../controllers/wishlist.js');
const Controllerabout = require('../controllers/aboutus.js');
const Controllerorderdetails = require('../controllers/order_details.js');
const Controllertrackorder = require('../controllers/track.js');
const Controllerplaceorder = require('../controllers/order.js');
const Controllercontactus = require('../controllers/contactus.js');
const Controllershipping_policy = require('../controllers/shipping-policy.js');
const Controllerprivacy_policy = require('../controllers/privacy-policy.js');
const Controllerexchange_policy = require('../controllers/exchange-policy.js');
const Controllerterms_condition = require('../controllers/terms_condition.js');
const Controllerfaq = require('../controllers/faq.js');
const Controllerlogin = require('../controllers/login.js');
const Controllersignup = require('../controllers/signup.js');
const Controlleraccount = require('../controllers/account.js');
const Controlleraddcart = require('../controllers/cart.js');

const Controllercheckmail = require('../controllers/checkmail.js');
const Controllersubscribe = require('../controllers/subscribe.js');
const Controllerheader = require('../controllers/headerweb.js');
const Controllershippingcheck = require('../controllers/shipping.js');

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
const Controlleruserlist = require('../controllers/userslist.js');
const Controllersubscribers = require('../controllers/subscribe.js');
const Controllercourier = require('../controllers/courier.js');
const Controllercoupon = require('../controllers/coupon.js');
const Controllerdealer = require('../controllers/dealer.js');
const Controllerorderretail = require('../controllers/order_list.js');



//web routes called

router.get('/', Controllerheader.getheaderInfo);
router.get('/portfolio/:id', Controllerport.getportfolioInfo);
router.get('/product/:id', Controllerproduct.getportproductInfo);
// router.get('/cart', Controllercart.getcartInfo);
router.post('/checkout', Controllercheckout.getcheckoutInfo);
router.post('/insert_address_data', Controllercheckout.insertdataaddress);
router.post('/store_value', Controllercheckout.storevalue);
router.get('/wishlist', Controllerwishlist.getwishlistInfo);
router.post('/add_wishlist_new', Controllerwishlist.addwishlistpro);
router.get('/aboutus', Controllerabout.getaboutInfo);
router.post('/track-order', Controllertrackorder.gettrackorderInfo);
router.post('/place_order', Controllerplaceorder.placeorder);
router.get('/order_details/:id/thank_you', Controllerorderdetails.orderDetails);

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
router.get('/login', Controllerlogin.getloginInfo);
router.get('/signup', Controllersignup.getsignupInfo);
router.post('/check_email_id', Controllercheckmail.getemail);
router.post('/account', Controlleraccount.addaccount);
router.post('/add_to_cart', Controlleraddcart.addtocart);
router.post('/update_to_cart', Controlleraddcart.updatetocart);
router.post('/view_cart_scheme', Controlleraddcart.viewcartscheme);
router.get('/cart', Controlleraddcart.viewcart);

router.post('/get_shipping', Controllershippingcheck.getshipping);
// router.get('/portfolio/:id', Controllerportfolio.getportfolio);
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
router.post('/retail_admin/subscriber_delete/:id',Controllersubscribers.deleteadmin)

router.get('/retail_admin/courier_add',Controllercourier.getadmincourier)
router.post('/retail_admin/courier_add_process',Controllercourier.addadmincourier)
router.post('/retail_admin/courier_delete/:id',Controllercourier.deleteadmincourier)
router.get('/retail_admin/courier_edit/:id', Controllercourier.courierEditInfo)
router.post('/retail_admin/courier_edit_process', Controllercourier.updatecourierEdit)

router.get('/retail_admin/coupon_add',Controllercoupon.getadmincoupon)
router.post('/retail_admin/coupon_add_process',Controllercoupon.addadmincoupon)
router.post('/retail_admin/coupon_delete/:id',Controllercoupon.deleteadmincoupon)
router.get('/retail_admin/coupon_edit/:id', Controllercoupon.couponEditInfo)
router.post('/retail_admin/coupon_edit_process', Controllercoupon.updatecoupon)
router.post('/retail_admin/monthly_coupon_process', Controllercoupon.monthlycoupon)
router.post('/retail_admin/coupon_edit_add_process', Controllercoupon.editaddcoupon)

router.get('/retail_admin/dealer_add', Controllerdealer.getdealer)
router.post('/retail_admin/dealer_add_process', Controllerdealer.adddealer)
router.post('/retail_admin/dealer_delete/:id', Controllerdealer.deletedealer)

router.get('/retail_admin/users_list',Controlleruserlist.getadminuserlist)
router.post('/retail_admin/view_users',Controlleruserlist.getadminuserslist)
router.get('/retail_admin/user_edit/:id', Controlleruserlist.userEditInfo)
router.post('/retail_admin/update_user_general', Controlleruserlist.userUpdateInfo)

router.get('/retail_admin/order_list', Controllerorderretail.getorderlist)

module.exports = router;