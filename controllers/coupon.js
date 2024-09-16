
const SubCategory = require("../models/subcategory");
const Category = require("../models/category");
const Brand = require("../models/brand");
const Coupon = require("../models/coupon")

const getadmincoupon = async (req, res) => {
    /* const sql_cat = await Category.find().sort({ category_name: 1 }).exec();
    const sql_subcat = await SubCategory.find().sort({ category_name: 1 }).exec();
    const sql_brand = await Brand.find().sort({ brand_name: 1 }).exec(); */
    const [categories, subcategories, brands, coupons] = await Promise.all([
        Category.find().sort({ category_name: 1 }).exec(),
        SubCategory.find().sort({ subcategory_name: 1 }).exec(),
        Brand.find().sort({ brand_name: 1 }).exec(),
        Coupon.find({ type: { $ne: 'voucher' }, is_delete: { $ne: '1' } }).sort({ _id: -1 }).exec()
    ]);


    // const sql_data = await Coupon.find()

    let num = 0;
    const data_review = [];
    for (const fetch of coupons) {
        const id = fetch._id
        const coupon_name = fetch.coupon_name
        const rupees = fetch.rupees ? `${fetch.rupees} Rs.` : '-';
        const percentage = fetch.percentage ? `${fetch.percentage}%` : '-';
        const point = fetch.point ? fetch.point : '-';
        const category_id = fetch.category_id || [];
        const user_id = fetch.user_id || [];
        const subcategory_id = fetch.subcategory_id || [];
        const brand_id = fetch.brand_id || [];
        const cart_limit = fetch.cart_limit
        const remark = fetch.remark
        const expiry_date = fetch.expiry_date
        const limitation = fetch.limitation
        const status = fetch.monthly
        // console.log("status",status);

        const active = fetch.visible

        /*if(status=='0'){
             status =='1' ? 'checked' : ''
        } */
            //  status = (status === '0') ? '' : 'checked';
        num++;

        const cat_names = categories
                .filter(cat => category_id.includes(cat._id.toString()))
                .map(cat => cat.category_name)
                .join(', ');

            const subcat_names = subcategories
                .filter(subcat => subcategory_id.includes(subcat._id.toString()))
                .map(subcat => subcat.subcategory_name)
                .join(', ');

            // Process brand names
            const brand_names = brands
                .filter(brand => brand_id.includes(brand._id.toString()))
                .map(brand => brand.brand_name)
                .join(', ');

        const viewapp = ``;

        const activeCheckbox = `<label class="switch">
                <input type="checkbox" id="act_${id}" ${active === '1' ? 'checked' : ''} onclick="active(${id})">
                <span class="slider round"></span>
            </label>`;

        const btn = ``;


        const data1 = {
            id:id,
            checkbox: `<input type="checkbox" id="delete_checkbox" name="delete_checkbox" value="${id}">`,
            //edit: `<a href="coupon_edit.php?id=${id}"><button type="button" class="btn btn-info icon-btn borderless"><span class="ion ion-md-create"></span></button></a>`,
            no: num,
            status: status,
            active: activeCheckbox,
            coupon_name: coupon_name,
            rupees: rupees,
            percentage: percentage,
            cart_limit: cart_limit,
            user: btn,
            category: cat_names,
            subcategory: subcat_names,
            brand: brand_names,
            remark: remark,
            expiry_date: expiry_date,
            limitation:limitation,
        };

        data_review.push(data1);

    }

    const results = {
        sEcho: 1,
        iTotalRecords: data_review.length,
        iTotalDisplayRecords: data_review.length,
        aaData: data_review,
    };

    res.render("retail_admin/views/coupon_add", {
        sql_cat: categories,
        sql_subcat: subcategories,
        sql_brand: brands,
        results: data_review,
    });
}

const addadmincoupon = async (req, res) => {
    const { coupon_name, rupees, point, affiliate, selected_cat, selected_subcat, selected_brand,
        limitation, percent, remark, expiry_date, user_id_hidden, cart_limit_box } = req.body;

    const sql_data = await Coupon.find({ coupon_name: coupon_name });

    if (sql_data.length) {
        res.send("exist")
    } else {

        /* if (typeof coupon_name !== 'string' || typeof rupees !== 'number' || typeof point !== 'number' ||
            typeof percent !== 'number' || typeof selected_cat !== 'string' || typeof user_id_hidden !== 'string' ||
            typeof selected_subcat !== 'string' || typeof selected_brand !== 'string' || typeof cart_limit_box !== 'number' ||
            typeof remark !== 'string' || typeof expiry_date !== 'string' || typeof limitation !== 'number' ||
            typeof affiliate !== 'boolean') {
            return res.status(400).send("Invalid data types");
        } */

        const coupon = new Coupon({
            coupon_name,
            rupees,
            percentage: percent,
            point,
            category_id: selected_cat,
            user_id: user_id_hidden,
            subcategory_id: selected_subcat,
            brand_id: selected_brand,
            cart_limit: cart_limit_box,
            remark,
            expiry_date,
            limitation,
            affiliate_coupon: affiliate,

        });

        const savedcoupon = await coupon.save();
        res.send("ok")
    }

}

const deleteadmincoupon = async(req,res) => {
    try {
        const couponid = req.params.id;
        const result = await Coupon.findByIdAndDelete(couponid);

        if (!result) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        /* res.json({ message: 'Brand deleted successfully' }); */
        //res.redirect('/brand_add');
        // res.status(302).set('Location', '/brand_add').end();
        res.send("ok")

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

const couponEditInfo = async(req,res) => {
    try {

        const couponId = req.params.id;
        const coupon = await Coupon.find({ _id:couponId});
        const sql_cat = await Category.find().sort({ category_name: 1 });
        const sql_subcat = await SubCategory.find().sort({ subcategory_name: 1 });
        const sql_brand = await Brand.find().sort({ brand_name: 1 });

        // const typeIds = Array.isArray(coupon.category_id) ? coupon.category_id : [coupon.category_id];
        const typeIds = coupon.map(doc => doc.category_id);
        const typeIdssubcat = coupon.map(doc => doc.subcategory_id);
        const typeIdsbrand = coupon.map(doc => doc.brand_id);

        if (!coupon) {
            return res.status(404).json({ error: 'Brand not found' })
        }

        res.render("retail_admin/views/coupon_edit", { coupon,sql_cat,sql_subcat,sql_brand,typeIds,typeIdssubcat,typeIdsbrand });

    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).send("Database query error");
    }
}

const updatecoupon = async(req,res) =>{

const {coupon_name,rupees,percent,affiliate,limitation,selected_cat,selected_subcat,
    selected_brand,remark,coupon_id,expiry_date,cart_limit_box}= req.body;
    try {

        await Coupon.updateOne(
            { _id: coupon_id },
            { $set: { coupon_name: coupon_name, rupees: rupees,
                percentage:percent,affiliate:affiliate,
                limitation:limitation,category_id:selected_cat,
                subcategory_id:selected_subcat,brand_id:selected_brand,
                remark:remark,expiry_date:expiry_date,cart_limit:cart_limit_box,
            } }
        );
        res.send('ok');

    } catch (error) {
        console.error('Data Update failed:', error);
        res.status(500).send({ status: 'error', message: 'Data Update failed.' });
    }


}

const monthlycoupon = async(req,res) => {
    const {request_id,appview} = req.body;
    try {

        await Coupon.updateOne(
            { $set: { monthly: appview } }
        );

        await Coupon.updateOne(
            { _id: request_id },
            { $set: { monthly: appview } }
        );
        res.send('ok');

    } catch (error) {
        console.error('Monthly Data Update failed:', error);
        res.status(500).send({ status: 'error', message: 'Monthly Data Update failed.' });
    }

}

const editaddcoupon = async(req,res)=>{
    const {coupon_id}= req.body;
}

module.exports = {
    getadmincoupon,
    addadmincoupon,
    deleteadmincoupon,
    couponEditInfo,
    updatecoupon,
    monthlycoupon,
    editaddcoupon,
}