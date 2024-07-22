const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SubCategory = require("../models/subcategory");
const Category = require("../models/category");
const Brand = require("../models/brand");
const Size = require("../models/size")
const product_master = require("../models/product");
const brandRelationMaster = require("../models/brand_relation_master")
const relationMaster = require("../models/relation_master")
const sizerelationMaster = require("../models/size_relation_master")
const productSubimage = require("../models/product_subimage")
const attribute = require("../models/attribute");
const subattribute = require("../models/sub_attribute_master");
const attributeRelation = require("../models/attribute_relation_master");


const { exit } = require('process');

const getproductInfo = async (req, res) => {

    try {
        const brand = await Brand.find({ brand_hide: 0 });
        const size = await Size.find({ size_hide: 0 });
        const category = await Category.find();
        const attributeData = await attribute.find();

        const subattributeData = await subattribute.find();

        res.render("retail_admin/views/product_add", { category, brand, size, attributeData, subattributeData });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

const getsubcat = async (req, res) => {

    const cat_id = req.params.id.split(',');
    let subtypeIds = [];

    if ((req.body.protype)) {
        subtypeIds = req.body.subtypeIds;
    }

    const result = await SubCategory.find({ category_id: { $in: cat_id } })

    res.status(200).send({ result, subtypeIds });
}

const checkrepeatproduct = async (req, res) => {

    const method = req.body.method;
    if (method === 'add') {

        const allProName = req.body.all_pro_name;
        const allProSku = req.body.all_pro_sku;
        const total = parseInt(req.body.total) - 1;

        let t = 0;
        let f = 0;

        for (let i = 0; i < total; i++) {
            const existingProduct = await product_master.findOne({ product_name: allProName[i] });

            if (existingProduct) {
                t++;
            } else {
                f++;
            }
        }

        if (t === 0) {
            res.send('ok');
        }
    }

    if (method === "update") {
        const product_name = req.body.product_name
        const product_sku = req.body.product_sku
        const productId = req.body._id

        const existingProduct = await product_master.findOne({ product_name: product_name, _id: { $ne: productId } })

        if (!existingProduct) {
            res.send('ok');
        }
    }

}

const productadd = async (req, res) => {

    try {

        const selected_cat = req.body['selected_cat[]'];

        const selected_subcat = req.body['selected_subcat[]'];
        const product_type1 = req.body.product_type1;
        const product_hsn = req.body['product_hsn[]'];
        const product_name = req.body['product_name[]'];
        const cname = req.body['cname[]'];
        const selected_brand = req.body['selected_brand[]'];
        const mrp_price = req.body['mrp_price[]'];
        const product_price = req.body['product_price[]'];
        const product_reseller_price = req.body['product_reseller_price'];
        const catalog_pcs = req.body['catalog_pcs[]'];
        const product_gst = req.body['product_gst[]'];
        const product_weight = req.body['product_weight[]'];
        const product_stitch = req.body['product_stitch[]'];
        const video_link = req.body['video_link[]'];
        const product_quantity = req.body['product_quantity[]'];
        var product_size = [];
        product_size = req.body['product_size1[]'];
        const product_quantity1 = req.body['product_quantity1[]'];
        var size_price1 = [];
        size_price1 = req.body['size_price1[]'];
        const total_attribute1 = req.body.total_attribute1;
        console.log("total_attribute1=", total_attribute1);
        var product_attribute1 = [];
        var product_subattribute1 = [];
        for (i = 1; i < total_attribute1; i++) {
            var product_attribute2 = req.body['product_attributea1[' + i + '][]'];
            product_attribute1.push(product_attribute2);

            var product_subattribute2 = req.body['product_subattribute1[' + i + '][]'];

            if (!Array.isArray(product_subattribute2)) {
                product_subattribute2 = [product_subattribute2];
            }

            product_subattribute1.push(product_subattribute2);
        }
        console.log("product_attribute1 length", product_attribute1.length);
        console.log("product_attribute1", product_attribute1);
        console.log("product_subattribute1", product_subattribute1);

        const accessories_length = req.body['accessories_length[]'];
        const fabric = req.body['fabric[]'];
        const top_fabric = req.body['top_fabric[]'];
        const bottom_fabric = req.body['bottom_fabric[]'];
        const catalog_type = req.body['catalog_type[]'];
        const moq = req.body['moq[]'];
        const length = req.body['length[]'];
        const bottom = req.body['bottom[]'];
        const saree_fabric = req.body['saree_fabric[]'];
        const cutfab = req.body['cutfab[]'];
        const lehenga_fabric = req.body['lehenga_fabric[]'];
        const dupatta_fabric = req.body['dupatta_fabric[]'];
        const inner_for = req.body['inner_for[]'];
        const blouse_fabric = req.body['blouse_fabric[]'];
        const disable_date = req.body['disable_date[]'];
        const product_short_description = req.body['product_short_description[]'];
        const product_full_description = req.body['product_full_description[]'];
        const product_status = req.body['product_status[]'];
        const product_meta_title = req.body['product_meta_title[]'];
        const product_meta_keyword = req.body['product_meta_keyword[]'];
        const product_meta_desc = req.body['product_meta_desc[]'];
        const editor = req.body['editor[]'];
        const notes = req.body.notes;
        const product_sku = req.body.product_sku;
        const total = req.body.total;
        const total_size1 = req.body.total_size1;

        const upcoming_checkbox = req.body['upcoming_checkbox[]']
        const product_type = req.body[`product_type1`]
        const selected_catalog = 0;
        const color = '';
        const author_name = 'Gajendra Bhamare';
        const totalCatalogPrice = parseInt(product_price) * parseInt(catalog_pcs);
        const totalCatalogPriceReseller = parseInt(product_reseller_price) * parseInt(catalog_pcs);
        const date = new Date().toISOString().slice(0, 10);
        const product_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const subimage = req.files['subimage_file1[]'];
        const size_checkbox = req.body['size_checkbox1[]']

        if (size_checkbox == "on") {
            if (Array.isArray(product_quantity1)) {
            quantity = product_quantity1.reduce((total, currentValue) => {

                const numberValue = parseInt(currentValue, 10);

                if (!isNaN(numberValue)) {
                    return total + numberValue;
                } else {
                    console.error(`Invalid value found in product_quantity1: ${currentValue}`);
                    return total;
                }
            }, 0);
        } else {
            quantity = product_quantity;
        }
    }

        if (upcoming_checkbox == "on") {
            upcoming = 1;
        } else {
            upcoming = 0;
        }

        let product_seo_url = product_name.toLowerCase();
        product_seo_url = product_seo_url.replace(/[^a-z0-9\-]/g, '-');
        product_seo_url = product_seo_url.replace(/-+/g, '-');

        const product_image = req.files.image_file;
        const datetime = new Date().toISOString().replace(/:/g, '-');
        const ext = path.extname(product_image.name);

        const basePath = './public/images/product/'
        const basePath1 = '/images/product/'
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

        const newName = `${product_seo_url}-${datetime}${ext}`;
        const newNamePath = path.join(monthFolder, newName);
        const newNamePath1 = path.join(monthFolder1, newName);
        await product_image.mv(newNamePath);


        const newProduct = new product_master({
            product_sku: product_sku,
            product_hsn: product_hsn,
            product_name: product_name,
            cname: cname,
            product_seo_url: product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            product_image: newNamePath1,
            product_qty: quantity,
            catalog_pcs: catalog_pcs,
            product_price: product_price,
            product_mrp_price: mrp_price,
            product_sale_price: totalCatalogPrice,
            product_reseller_price: product_reseller_price,
            /* product_reseller_mrp_price: mrp_reseller_price, */
            product_reseller_sale_price: totalCatalogPriceReseller,
            product_gst: product_gst,
            product_weight: product_weight,
            product_stitch: product_stitch,
            catalog_type: catalog_type,
            moq: moq,
            top_fabric: top_fabric,
            bottom_fabric: bottom_fabric,
            dupatta_fabric: dupatta_fabric,
            lehenga_fabric: lehenga_fabric,
            saree_fabric: saree_fabric,
            blouse_fabric: blouse_fabric,
            inner_for: inner_for,
            cutfab: cutfab,
            color: color,
            bottom: bottom,
            length: length,
            accessories_length: accessories_length,
            product_short_description: product_short_description,
            product_full_description: product_full_description,
            product_status: product_status,
            product_meta_title: product_meta_title,
            product_meta_keyword: product_meta_keyword,
            product_meta_description: product_meta_desc,
            disable_date: disable_date ? new Date(disable_date) : null,
            upcoming: upcoming,
            product_type: product_type,
            other_detail: editor,
            video_link: video_link,
            single_catalog: selected_catalog,
            product_date: product_date,
            push_to_top_date: product_date,
            added_by: author_name,
            fabric: fabric,
            note: notes
        });

        const insertProduct = await newProduct.save();
        const lastInsertedId = newProduct._id;

        if (insertProduct) {

            if (selected_brand != '') {
                const newBrandRelation = new brandRelationMaster({
                    brand_id: selected_brand,
                    product_id: lastInsertedId,
                    date: date,
                    brand_type: 'catalog'
                })
                await newBrandRelation.save();
            }


            if (Array.isArray(selected_cat)) {
                if (selected_cat.length > 0) {
                    const saveRelations = async () => {
                        try {
                            for (const cat_id of selected_cat) {
                                const catRelation = new relationMaster({
                                    product_id: lastInsertedId,
                                    type_id: cat_id,
                                    type: 'cat'
                                });
                                await catRelation.save();
                            }
                            console.log('Relations saved successfully.');
                        } catch (error) {
                            console.error('Error saving relations:', error);
                        }
                    };

                    saveRelations();
                } else {
                    console.log('No categories selected.');
                }
            } else {
                const catRelation = new relationMaster({
                    product_id: lastInsertedId,
                    type_id: selected_cat,
                    type: 'cat'
                });

                catRelation.save()
                    .then(() => {
                        console.log('Relation saved successfully.');
                    })
                    .catch(error => {
                        console.error('Error saving relation:', error);
                    });
            }

            // Check if selected_subcat is an array before attempting to iterate over it
            if (Array.isArray(selected_subcat)) {
                if (selected_subcat.length > 0) {
                    const saveRelations = async () => {
                        try {
                            for (const subcat_id of selected_subcat) {
                                const subcatRelation = new relationMaster({
                                    product_id: lastInsertedId,
                                    type_id: subcat_id,
                                    type: 'subcat'
                                });
                                await subcatRelation.save();
                            }
                            console.log('Relations saved successfully.');
                        } catch (error) {
                            console.error('Error saving relations:', error);
                        }
                    };

                    saveRelations();
                } else {
                    console.log('No subcategories selected.');
                }
            } else {

                const subcatRelation = new relationMaster({
                    product_id: lastInsertedId,
                    type_id: selected_subcat,
                    type: 'subcat'
                });
                try {
                    await subcatRelation.save();

                } catch (error) {
                    console.error('Error saving single subcategory relation:', error);
                }
            }

            if (size_checkbox == "on") {
                for (let k = 0; k < product_size.length; k++) {
                    const sizeId = product_size[k];

                    const size = await Size.findById(sizeId);
                    const productSkuSize = "GB";
                    let sizePriceNew = size_price1[k];

                    if (size_price1[k] === "" || size_price1[k] === "0") {
                        sizePriceNew = product_price;
                    }

                    const sizeRelation = new sizerelationMaster({
                        size_id: sizeId,
                        catalog_id: '0',
                        product_id: lastInsertedId,
                        product_sku: productSkuSize,
                        product_price: sizePriceNew,
                        size_qty: product_quantity1[k],
                        date: date,
                        size_type: 'catalog'
                    });
                    const insertsize = await sizeRelation.save();

                }
            }


            if (product_attribute1.length > 0) {
                for (let key = 0; key < product_attribute1.length; key++) {
                    const attributevalue = product_attribute1[key];
                    const fetch_attribute = await attribute.findOne({ _id: attributevalue }).sort({ attribute_name: 1 });
                    if (fetch_attribute) {
                        const attribute_name = fetch_attribute.attribute_name;

                        for (let k = 0; k < product_subattribute1[key].length; k++) {
                            const attributeValue = product_subattribute1[key][k];
                            const insertattribute = new attributeRelation({
                                attribute_name: attribute_name,
                                product_id: lastInsertedId,
                                attribute_value: attributeValue,
                            })
                            const insertrelarion = await insertattribute.save();
                        }
                    }
                }
            }


            for (let k = 0; k < subimage.length; k++) {

                if (subimage[k] != '') {
                    const datetime = new Date().toISOString().replace(/:/g, '-');
                    const ext = path.extname(subimage[k].name);

                    const basePath = './public/images/product/sub_images'
                    const basePath1 = '/images/product/sub_images'
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

                    const newName = `${product_seo_url}-${datetime}${ext}`;
                    const newNamePath = path.join(monthFolder, newName);
                    const newNamePath1 = path.join(monthFolder1, newName);
                    await subimage[k].mv(newNamePath);

                    try {
                        const productsubimage = new productSubimage({
                            product_id: lastInsertedId,
                            subimage: newNamePath1,
                            subimage_date: date,
                            subimage_type: "catalog"
                        })

                        const insertsubimage = await productsubimage.save();

                    } catch (error) {
                        console.error('File Extention is not valid:', error);
                    }


                }

            }

        }

        res.redirect('/retail_admin/views/product_add');

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }


}

module.exports = {
    getproductInfo,
    getsubcat,
    checkrepeatproduct,
    productadd,

}