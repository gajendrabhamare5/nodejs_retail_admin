const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Category = require("../models/category");

const getCategory = async (req, res) => {
    try {

        // const sqlData = await Category.find({order: [['category_sort', 'ASC']]});
        const sqlData = await Category.find().sort({ category_sort: 'asc' });
        let num = 0;
        const data_cat = [];

        for (const fetch of sqlData) {
            const category_id = fetch.category_id;

            let image = fetch.category_image;
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
            let hide = fetch.category_hide;
            let hide_icon;
            if (hide == "0") {
                hide = "No";
                hide_icon = "ion-md-eye-off";
            } else if (hide == "1") {
                hide = "Yes";
                hide_icon = "ion-md-eye";
            }

            const id = fetch._id
            const meta_title = fetch.category_meta_title;
            const meta_keyword = fetch.category_meta_keyword;
            const meta_description = fetch.category_meta_description;
            const sort = fetch.category_sort;

            num++;

            const data1 = {
                checkbox: `<input type="checkbox" id="delete_checkbox" name="delete_checkbox" value="${id}">`,
                edit: `<a href="category_edit/${id}"><button type="button" class="btn btn-info icon-btn borderless"><span class="ion ion-md-create"></span></button></a>`,
                no: num,
                hide: `<button type="button" onclick="hide_category('${id}')" class="btn btn-outline-info icon-btn borderless">
                        <span class="ion ${hide_icon}"></span>
                        </button>`,
                image: `<img src="${image}" alt="image" style="max-height:50px;max-width:50px;">`,
                name: fetch.category_name,
                cat_seo_url: fetch.category_seo_url,
                cat_mob_no: fetch.cat_mobile,
                meta_title: meta_title,
                meta_keyword: meta_keyword,
                meta_description: meta_description,
                category_sort: sort,
                other_details: fetch.other_details,
            };

            data_cat.push(data1);

        }
        const results = {
            sEcho: 1,
            iTotalRecords: data_cat.length,
            iTotalDisplayRecords: data_cat.length,
            aaData: data_cat,
        };

        /* res.json(results); */
        /* const category_masters = await Category.find(); */
        /* res.render("category_add", { categories }); */

        res.render("retail_admin/views/category_add", { category_masters: data_cat });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

const createCategory = async (req, res) => {
    try {
        const {
            cat_name,
            cat_slug,
            cat_mobile,
            cat_sort,
            cat_meta_title,
            cat_meta_keyword,
            cat_meta_desc,
            catcontent
        } = req.body;


        let cat_seo_url = cat_name.toLowerCase();
        cat_seo_url = cat_seo_url.replace(/[^a-z0-9\-]/g, '-');
        cat_seo_url = cat_seo_url.replace(/-+/g, '-');

        /* if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
 */

        const category_image = req.files ? req.files.image_file : null;

        const category_banner = null;
        const category_delete = 0;
        const category_hide = 0;
        const date = new Date();

        if(category_image != null){

        const datetime = new Date().toISOString().replace(/:/g, '-');
        const ext = path.extname(category_image.name);
        const catSeoUrl = req.body.cat_seo_url;

        const basePath = './public/images/category/'
        const basePath1 = '/images/category/'
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

        const newName = `${catSeoUrl}-${datetime}${ext}`;
        const newNamePath = path.join(monthFolder, newName);
        const newNamePath1 = path.join(monthFolder1, newName);
        await category_image.mv(newNamePath);

        const category = new Category({

            category_name: cat_name,
            category_seo_url: cat_seo_url,
            category_image: newNamePath1,
            category_banner,
            category_meta_title: cat_meta_title,
            category_meta_keyword: cat_meta_keyword,
            category_meta_description: cat_meta_desc,
            other_details: catcontent,
            category_sort: cat_sort,
            cat_mobile,
            category_delete,
            category_hide,
            date

        });
        // const savedCategory = await category.save();
        const savedCategory = await category.save();
        }else{

            const category = new Category({

                category_name: cat_name,
                category_seo_url: cat_seo_url,
                category_image: '',
                category_banner,
                category_meta_title: cat_meta_title,
                category_meta_keyword: cat_meta_keyword,
                category_meta_description: cat_meta_desc,
                other_details: catcontent,
                category_sort: cat_sort,
                cat_mobile,
                category_delete,
                category_hide,
                date

            });
            const savedCategory = await category.save();
        }
        res.redirect('retail_admin/category');
    } catch (error) {
        res.status(400).send(error);
    }

}

const catgoryHide = async (req, res) => {
    const categoryId = req.params.id;
    console.log(categoryId);

    try {
        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return res.status(404).send("Category not found");
        }

        category.category_hide = category.category_hide === "0" ? "1" : "0";
        await category.save();

        res.redirect('retail_admin/category');
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Database query error");
    }

};

const catgoryDelete = async (req, res) => {
    try {

        const categoryId = req.params.id;
        const result = await Category.findByIdAndDelete(categoryId);

        if (!result) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
        res.redirect('retail_admin/category');

    } catch (error) {

        res.status(500).send("Database query error");
    }
}

const catgoryEditInfo = async (req, res) => {
    try {
        // console.log(" in category edit info ");
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' })
        }

        res.render("retail_admin/views/category_edit", { category });

    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).send("Database query error");
    }
}

const updatecatgory = async (req, res) => {
    try {

        const categoryId = req.params.id;

        const { cat_name, cat_sort, cat_meta_title, cat_meta_keyword, cat_meta_desc, catcontent } = req.body;

        let cat_seo_url = cat_name.toLowerCase();
        cat_seo_url = cat_seo_url.replace(/[^a-z0-9\-]/g, '-');
        cat_seo_url = cat_seo_url.replace(/-+/g, '-');

        const category_image = req.files ? req.files.image_file : null

        let updateFields = {};
        if (cat_name) updateFields.category_name = cat_name;
        if (cat_seo_url) updateFields.category_seo_url = cat_seo_url;
        if (cat_sort) updateFields.category_sort = cat_sort;
        if (cat_meta_title) updateFields.category_meta_title = cat_meta_title;
        if (cat_meta_keyword) updateFields.category_meta_keyword = cat_meta_keyword;
        if (cat_meta_desc) updateFields.category_meta_description = cat_meta_desc;
        if (catcontent) updateFields.other_details = catcontent;

        if (category_image && category_image.size > 0) {
            const datetime = new Date().toISOString().replace(/:/g, '-');
            const ext = path.extname(category_image.name);
            const catSeoUrl = req.body.cat_seo_url;

            const basePath = './public/images/category/'
            const basePath1 = '/images/category/'
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

            const newName = `${catSeoUrl}-${datetime}${ext}`;
            const newNamePath = path.join(monthFolder, newName);
            const newNamePath1 = path.join(monthFolder1, newName);
            await category_image.mv(newNamePath);
            updateFields.category_image = newNamePath1;
        }





        const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateFields, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.redirect('retail_admin/category');

    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).send("Database query error");
    }
}

module.exports = {
    createCategory,
    getCategory,
    catgoryHide,
    catgoryDelete,
    catgoryEditInfo,
    updatecatgory,

};