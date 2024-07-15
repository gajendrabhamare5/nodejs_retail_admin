const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const Brand = require("../models/brand");

const getbrand = async (req,res) =>{
    const sqlData = await Brand.find()

    let num = 0;
    const data_brand = [];

    for (const fetch of sqlData) {

        let image = fetch.brand_image;
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
        let hide = fetch.brand_hide;
        let hide_icon;
        if (hide == "0") {
            hide = "No";
            hide_icon = "ion-md-eye-off";
        } else if (hide == "1") {
            hide = "Yes";
            hide_icon = "ion-md-eye";
        }

        let brand_hide = fetch.brand_hide;
        if(brand_hide == "0"){
            brand_hide = "No"
        }else if(brand_hide=="1"){
            brand_hide = "Yes"
        }


        const id = fetch._id
        const meta_title = fetch.brand_meta_title;
        const meta_keyword = fetch.brand_meta_keyword;
        const meta_description = fetch.brand_meta_description;
        const brand_description = fetch.brand_description;

        num++;

        const data1 = {
            checkbox: `<input type="checkbox" id="delete_checkbox" name="delete_checkbox" value="${id}">`,
            edit: `<a href="brand_edit/${id}"><button type="button" class="btn btn-info icon-btn borderless"><span class="ion ion-md-create"></span></button></a>`,
            no: num,
            hide: `<button type="button" onclick="hide_brand('${id}')" class="btn btn-outline-info icon-btn borderless">
                    <span class="ion ${hide_icon}"></span>
                    </button>`,
            image: `<img src="${image}" alt="image" style="max-height:50px;max-width:50px;">`,
            name: fetch.brand_name,
            cat_seo_url: fetch.category_seo_url,
            meta_title: meta_title,
            meta_keyword: meta_keyword,
            meta_description: meta_description,
            brand_hide:brand_hide,
            brand_description: fetch.brand_description,
        };

        data_brand.push(data1);

    }
    const results = {
        sEcho: 1,
        iTotalRecords: data_brand.length,
        iTotalDisplayRecords: data_brand.length,
        aaData: data_brand,
    };


res.render("brand_add", { brand_master: data_brand })
}

const insertbrand = async (req,res) =>{
    try {

const {
    brand_name,
    brand_title,
    brand_keyword,
    brand_description,
    content,
 }= req.body;

 const brandimage = req.files ? req.files.image_file: null;

 const brand_hide = 0;
 const top_brands = 0;
 const date = new Date();

 let brand_seo_url = brand_name.toLowerCase();
        brand_seo_url = brand_seo_url.replace(/[^a-z0-9\-]/g, '-');
        brand_seo_url = brand_seo_url.replace(/-+/g, '-');

    if(brandimage != null){

        const datetime = new Date().toISOString().replace(/:/g, '-');
        const ext = path.extname(brandimage.name);
        const brandSeoUrl = req.body.brand_seo_url;

        const basePath = './public/images/brand/'
        const basePath1 = '/images/brand/'
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

        const newName = `${brandSeoUrl}-${datetime}${ext}`;
        const newNamePath = path.join(monthFolder, newName);
        const newNamePath1 = path.join(monthFolder1, newName);
        await brandimage.mv(newNamePath);

        const brand = new Brand({

            brand_name: brand_name,
            brand_image: newNamePath1,
            brand_seo_url: brand_seo_url,
            brand_meta_title:brand_title,
            brand_meta_keyword: brand_keyword,
            brand_meta_description: brand_description,
            brand_description: content,
            brand_hide: brand_hide,
            top_brands: top_brands,
            date,

        });

        const savedbrand = await brand.save();

    }else{

        const brand = new Brand({

            brand_name: brand_name,
            brand_image: '',
            brand_seo_url: brand_seo_url,
            brand_meta_title:brand_title,
            brand_meta_keyword: brand_keyword,
            brand_meta_description: brand_description,
            brand_description: content,
            brand_hide: brand_hide,
            top_brands: top_brands,
            date,

        });

        const savedbrand = await brand.save();

    }

        res.redirect('/brand_add');

    } catch (error) {
        console.log(error);
        res.status(500).send("Intrnal Server Error");
    }
}

const deletebrand = async (req,res)=>{

   try {
    const brandid = req.params.id;
    const result = await Brand.findByIdAndDelete(brandid);

    if (!result) {
        return res.status(404).json({ error: 'Brand not found' });
    }

    /* res.json({ message: 'Brand deleted successfully' }); */
    res.redirect('/brand_add');

   } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error")
   }


}

const brandHide = async (req,res)=>{
try {

    const brandId = req.params.id;

    const brand = await Brand.findOne({ _id: brandId });

    if (!brand) {
        return res.status(404).send("Brand not found");
    }

    brand.brand_hide = brand.brand_hide === "0" ? "1" : "0";
    await brand.save();

    res.redirect('/brand_add');

} catch (error) {
console.log(error);
res.status(500).send("Internal Server Error")
}
}

const brandEditInfo = async (req,res)=>{
    try {
        // console.log(" in brand edit info ");
         const brandId = req.params.id;
         const brand = await Brand.findById(brandId);

         if (!brand) {
             return res.status(404).json({ error: 'Brand not found' })
         }

         res.render("brand_edit", { brand });

     } catch (error) {
         console.error("Error executing query", error);
         res.status(500).send("Database query error");
     }
}

const updatebrand = async (req,res)=>{
    try {

        const brandId = req.params.id;

        const { brand_name, brand_title, brand_keyword, brand_description, content } = req.body;

        const brand_image = req.files ? req.files.image_file :null

        let updateFields = {};
        if (brand_name) updateFields.category_name = brand_name;
        if (brand_title) updateFields.brand_meta_title = brand_title;
        if (brand_keyword) updateFields.brand_meta_keyword = brand_keyword;
        if (brand_description) updateFields.brand_meta_description = brand_description;
        if (content) updateFields.brand_description = content;


        if (brand_image && brand_image.size > 0) {
        const datetime = new Date().toISOString().replace(/:/g, '-');
        const ext = path.extname(brand_image.name);
        const catSeoUrl = req.body.cat_seo_url;

        const basePath = './public/images/brand/'
        const basePath1 = '/images/brand/'
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
        await brand_image.mv(newNamePath);
         updateFields.brand_image = newNamePath1;
    }





        const updatedbrand = await Brand.findByIdAndUpdate(brandId, updateFields, { new: true });

        if (!updatedbrand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        res.redirect('/brand_add');

    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).send("Database query error");
    }
}

module.exports = {
    getbrand,
    insertbrand,
    deletebrand,
    brandHide,
    brandEditInfo,
    updatebrand,
}