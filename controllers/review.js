const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const Product = require("../models/product");
const Review = require("../models/review");

const getadminreview = async (req, res) => {
    const sql_data = await Product.find();
    const sql_data_review = await Review.find();

    let num = 0;
    const data_review = [];
    for (const fetch of sql_data_review) {
        const product_id = fetch.product_id

        const getproduct_name = await Product.findOne({ _id: product_id }, 'product_name');

        const product_name = getproduct_name ? getproduct_name.product_name : "Unknown Category";

        let image = fetch.customer_image;
        if (!image) {
            image = "http://placehold.it/150";
        } else {

            const ext = image.split('.').pop();
            if (!ext) {
                image = "http://placehold.it/150";
            } else {
                image = "http://localhost:4000/" + image;
            }

        }

        const id = fetch._id

        const customer_name = fetch.customer_name;
        const customer_review = fetch.customer_review;
        const star = fetch.star;
        const date = fetch.date;

        num++;

        const data1 = {
            checkbox: `<input type="checkbox" id="delete_checkbox" name="delete_checkbox" value="${id}">`,
            edit: `<a href="/retail_admin/review_edit/${id}"><button type="button" class="btn btn-info icon-btn borderless"><span class="ion ion-md-create"></span></button></a>`,
            no: num,
            image: `<img src="${image}" alt="image" style="max-height:50px;max-width:50px;">`,
            // image: fetch.image,
            product_id: product_name,
            customer_name: customer_name,
            customer_review: customer_review,
            star: star,
        };

        data_review.push(data1);

    }
    const results = {
        sEcho: 1,
        iTotalRecords: data_review.length,
        iTotalDisplayRecords: data_review.length,
        aaData: data_review,
    };

    res.render("retail_admin/views/review_product", { sql_data, review_master: data_review });
}

const addadminreview = async (req, res) => {
    const { pro_id, cust_name, cust_review, star_review } = req.body;

    const image = req.files ? req.files['image_file'] : null;
    var date = new Date();
    const fetch_user = await Review.find({ customer_name: cust_name });

    if (fetch_user.length > 0) {
        res.send({ status: 'error', message: 'Review from this customer already exists' });
    } else {



        if (!image) {

            const review = new Review({
                product_id: pro_id,
                customer_name: cust_name,
                customer_review: cust_review,
                star: star_review,
                Datetime: date,
            });

            const savedReview = await review.save();
            res.send({ status: 'ok', message: 'Inserted successfullydd' });
        } else {

            const datetime = new Date().toISOString().replace(/:/g, '-');
            const ext = path.extname(image.name);

            const basePath = './public/images/review/'
            const basePath1 = '/images/review/'
            const yearFolder = path.join(basePath, new Date().getFullYear().toString());
            const yearFolder1 = path.join(basePath1, new Date().getFullYear().toString());
            const monthFolder = path.join(yearFolder, (new Date().getMonth() + 1).toString());
            const monthFolder1 = path.join(yearFolder1, (new Date().getMonth() + 1).toString());

            if (!fs.existsSync(yearFolder)) {
                fs.mkdirSync(yearFolder, { recursive: true });
            }

            if (!fs.existsSync(monthFolder)) {
                fs.mkdirSync(monthFolder, { recursive: true });
            }

            const newName = `${datetime}${ext}`;
            const newNamePath = path.join(monthFolder, newName);
            const newNamePath1 = path.join(monthFolder1, newName);
            await image.mv(newNamePath);

            try {
                const review = new Review({
                    product_id: pro_id,
                    customer_name: cust_name,
                    customer_review: cust_review,
                    star: star_review,
                    customer_image: newNamePath1,
                    Datetime: date,
                });

                const savedReview = await review.save();
                console.log("savedReview=", savedReview);

                res.send({ status: 'ok', message: 'Inserted successfully' });
            } catch (err) {
                console.error('Data Inserted failed:', err);
                res.status(500).send({ status: 'error', message: 'Data inserted failed.' });
            }

        }
    }
}

const reviewEditInfo = async (req, res) => {
    try {

        const review_id = req.params.id;


        const review_data = await Review.find({ _id: review_id });


        const product_data = await Product.find();

        res.render("retail_admin/views/review_edit", { review_data, product_data, review_id });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

const updatereview = async (req, res) => {
    const { review_id, pro_id, cust_name, cust_review } = req.body;

    const image = req.files ? req.files['image_file'] : null;
    var date = new Date();

    const sql_data = Review.find({
        customer_name: cust_name,
        Id: { $ne: review_id }
    });

    if (sql_data.length > 0) {
        res.send({ status: 'error', message: 'Review from this customer already exists' });
    } else {
        if (!image) {
            await Review.updateOne(
                { _id: review_id },
                { $set: { product_id: pro_id, customer_name: cust_name,customer_review:cust_review } }
            );
            res.send('ok');
        }else{
            const datetime = new Date().toISOString().replace(/:/g, '-');
            const ext = path.extname(image.name);

            const basePath = './public/images/review/'
            const basePath1 = '/images/review/'
            const yearFolder = path.join(basePath, new Date().getFullYear().toString());
            const yearFolder1 = path.join(basePath1, new Date().getFullYear().toString());
            const monthFolder = path.join(yearFolder, (new Date().getMonth() + 1).toString());
            const monthFolder1 = path.join(yearFolder1, (new Date().getMonth() + 1).toString());

            if (!fs.existsSync(yearFolder)) {
                fs.mkdirSync(yearFolder, { recursive: true });
            }

            if (!fs.existsSync(monthFolder)) {
                fs.mkdirSync(monthFolder, { recursive: true });
            }

            const newName = `${datetime}${ext}`;
            const newNamePath = path.join(monthFolder, newName);
            const newNamePath1 = path.join(monthFolder1, newName);
            await image.mv(newNamePath);

            await Review.updateOne(
                { _id: review_id },
                { $set: { product_id: pro_id, customer_name: cust_name,customer_review:cust_review,customer_image:newNamePath1 } }
            );
            res.send('ok');
        }


    }

}

const deletereview = async (req,res)=>{
    const reviewid = req.params.id;
    console.log("id",reviewid);
    if (!reviewid) {
        res.send('error')
    } else {
        const result = await Review.deleteOne({ _id: reviewid });
        res.send('ok');
    }
}

module.exports = {
    getadminreview,
    addadminreview,
    reviewEditInfo,
    updatereview,
    deletereview,
}