const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const SubCategory = require("../models/subcategory");
const Category = require("../models/category");
const { log } = require('console');

const mongoose = require('mongoose');

const getSubCategory = async (req, res) => {
    try {

        const category = await Category.find();

        const sqlData = await SubCategory.find();
        console.log("sqlData",sqlData);

        let num = 0;
        const data_cat = [];

        for (const fetch of sqlData) {
            const category_id = fetch.category_id;
            console.log("category_id",category_id);
            if (mongoose.Types.ObjectId.isValid(category_id)) {
                // Convert category_id to ObjectId for querying
                const categoryObjectId = new mongoose.Types.ObjectId(category_id)

                // Find category name using category_id
                const getcategory_name = await Category.findOne({ _id: categoryObjectId }, 'category_name');
                console.log("Get Category Name:", getcategory_name);

                // Check if the category was found
                const cat_name = getcategory_name ? getcategory_name.category_name : "Unknown Category";
                console.log("Category Name:", cat_name);

            let image = fetch.subcategory_image;
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
            let hide = fetch.subcategory_hide;
            let hide_icon;
            if (hide == "0") {
                hide = "No";
                hide_icon = "ion-md-eye-off";
            } else if (hide == "1") {
                hide = "Yes";
                hide_icon = "ion-md-eye";
            }

            const id = fetch._id;
            const meta_title = fetch.subcategory_meta_title;
            const meta_keyword = fetch.subcategory_meta_keyword;
            const meta_description = fetch.subcategory_meta_description;

            num++;

            const data1 = {
                checkbox: `<input type="checkbox" id="delete_checkbox" name="delete_checkbox" value="${id}">`,
                edit: `<a href="subcategory_edit/${id}"><button type="button" class="btn btn-info icon-btn borderless"><span class="ion ion-md-create"></span></button></a>`,
                no: num,
                hide: `<button type="button" onclick="hide_subcategory('${id}')" class="btn btn-outline-info icon-btn borderless">
                        <span class="ion ${hide_icon}"></span>
                        </button>`,
                image: `<img src="${image}" alt="image" style="max-height:50px;max-width:50px;">`,
                name: fetch.subcategory_name,
                cat_seo_url: fetch.subcategory_seo_url,
                cat_name: cat_name,
                meta_title: meta_title,
                meta_keyword: meta_keyword,
                meta_description: meta_description,
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
    }

        res.render("retail_admin/views/subcategory_add", { category, subcategory_masters: data_cat });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }

}

const createSubCategory = async (req, res) => {
    try {

        const { cat_id, subcat_name, subcat_slug, subcat_meta_title, subcat_meta_keyword, subcat_meta_desc, content, } = req.body;

        let subcat_seo_url = subcat_name.toLowerCase();
        subcat_seo_url = subcat_seo_url.replace(/[^a-z0-9\-]/g, '-');
        subcat_seo_url = subcat_seo_url.replace(/-+/g, '-');

       /*  if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        } */

        /*  console.log("req-body");
         console.log(req.body); */
         const subcategory_image = req.files ? req.files.image_file : null;

         const subcategory_delete = 0;
         const subcategory_hide = 0;
         const date = new Date();

if(subcategory_image != null){

    const datetime = new Date().toISOString().replace(/:/g, '-');
    const ext = path.extname(subcategory_image.name);
    const subcatSeoUrl = req.body.subcat_seo_url;
    const basePath = './public/images/subcategory/'
    const basePath1 = '/images/subcategory/'
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

    const newName = `${subcatSeoUrl}-${datetime}${ext}`;
    const newNamePath = path.join(monthFolder, newName);
    const newNamePath1 = path.join(monthFolder1, newName);
    await subcategory_image.mv(newNamePath);

    const subcategory = new SubCategory({

        category_id: cat_id,
        subcategory_name: subcat_name,
        subcategory_seo_url: subcat_seo_url,
        subcategory_image: newNamePath1,
        subcategory_meta_title: subcat_meta_title,
        subcategory_meta_keyword: subcat_meta_keyword,
        subcategory_meta_description: subcat_meta_desc,
        other_details: content,
        subcategory_delete,
        subcategory_hide,
        date

    });

    const savedsubCategory = await subcategory.save();

}else{

    const subcategory = new SubCategory({

        category_id: cat_id,
        subcategory_name: subcat_name,
        subcategory_seo_url: subcat_seo_url,
        subcategory_image: '',
        subcategory_meta_title: subcat_meta_title,
        subcategory_meta_keyword: subcat_meta_keyword,
        subcategory_meta_description: subcat_meta_desc,
        other_details: content,
        subcategory_delete,
        subcategory_hide,
        date

    });
    const savedsubCategory = await subcategory.save();
}


        res.redirect('/retail_admin/subcategory_add');

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

const subcatgoryDelete = async (req, res) => {

    try {

        const subcategoryId = req.params.id;

        const result = await SubCategory.findByIdAndDelete(subcategoryId);

        if (!result) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }

        // res.json({ message: 'Subcategory deleted successfully' });
        res.send('ok');

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }

}

const subcatgoryEditInfo = async (req, res) => {

    try {

        const sub_cat_id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(sub_cat_id)) {
            return res.status(400).send("Invalid subcategory ID");
        }


        const category = await Category.find();
        const subcategory = await SubCategory.findById(sub_cat_id);

        if (!subcategory) {
            return res.status(404).send("Subcategory not found");
        }

        res.render("retail_admin/views/subcategory_edit", { category, subcategory });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

const updatesubcatgory = async (req, res) => {
    try {
        const SubcatId = req.params.id;
        const { selected_cat, subcat_name, subcat_slug, subcat_meta_title, subcat_meta_keyword, subcat_meta_desc, content } = req.body


        const subcategory_image = req.files ? req.files.image_file :null

        let subcat_seo_url = subcat_name.toLowerCase();
        subcat_seo_url = subcat_seo_url.replace(/[^a-z0-9\-]/g, '-');
        subcat_seo_url = subcat_seo_url.replace(/-+/g, '-');

        let updateFields = {};
        if (selected_cat) updateFields.category_id = selected_cat;
        if (subcat_name) updateFields.subcategory_name = subcat_name;
        if (subcat_seo_url) updateFields.subcategory_seo_url = subcat_seo_url;
        if (subcat_meta_title) updateFields.subcategory_meta_title = subcat_meta_title;
        if (subcat_meta_keyword) updateFields.subcategory_meta_keyword = subcat_meta_keyword;
        if (subcat_meta_desc) updateFields.subcategory_meta_description = subcat_meta_desc;
        if (content) updateFields.other_details = content;

        if (subcategory_image && subcategory_image.size > 0) {

        const datetime = new Date().toISOString().replace(/:/g, '-');
        const ext = path.extname(subcategory_image.name);

        const basePath = './public/images/subcategory/'
        const basePath1 = '/images/subcategory/'
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

        const newName = `${subcat_seo_url}-${datetime}${ext}`;
        const newNamePath = path.join(monthFolder, newName);
        const newNamePath1 = path.join(monthFolder1, newName);
        await subcategory_image.mv(newNamePath);
        updateFields.subcategory_image = newNamePath1;
        }

        const updatedsubcategory = await SubCategory.findByIdAndUpdate(SubcatId, updateFields, { new: true });
        res.redirect("/retail_admin/subcategory_add")

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

module.exports = {
    getSubCategory,
    createSubCategory,
    subcatgoryDelete,
    subcatgoryEditInfo,
    updatesubcatgory,
}