const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const Product = require("../models/product");
const Review = require("../models/review");

const getadminreview = async (req, res) => {
    const sql_data = await Product.find();
    // console.log("sql_data",sql_data);
    res.render("retail_admin/views/review_product", { sql_data });
}

const addadminreview = async (req, res) => {
    const { pro_id, cust_name, cust_review, star_review } = req.body;
    console.log("cust_name", cust_name);

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



module.exports = {
    getadminreview,
    addadminreview,
}