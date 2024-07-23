const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const moment = require('moment')
const { format } = require('date-fns');
var in_array = require('in_array');
const { MongoClient, ObjectId } = require('mongodb');

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
const attributeRelation = require("../models/attribute_relation_master");
const subattribute = require("../models/sub_attribute_master");

const getproductpage = async (req, res) => {
    try {

        const productId = req.params.id;
        const sql_product = await product_master.findOne({ _id: productId })

        const fetch_attr = await attribute.find();
        const fetch_subattr = await attributeRelation.find();
        const fetch_subattribute = await subattribute.find();

        const date = new Date(sql_product.disable_date);
        const disableDate = format(date, 'yyyy-MM-dd');

        const pushtotopdate = new Date(sql_product.push_to_top_date);
        const pushtotopDate = format(pushtotopdate, 'yyyy-MM-dd');

        const sql_subimage = await productSubimage.find({ product_id: productId, subimage_type: 'catalog' })

        const category = await Category.find();

        const sql_relation_cat = await relationMaster.find({ product_id: productId, type: 'cat' })

        const typeIds = sql_relation_cat.map(doc => doc.type_id);

        /*   sql_relation_cat.forEach(doc => {
              doc.typeIds = type_id
          }); */

        const sql_relation_subcat = await relationMaster.find({ product_id: productId, type: 'subcat' })
        const subtypeIds = sql_relation_subcat.map(doc => doc.type_id);
        // console.log("subtypeIds",subtypeIds);

        const brand = await Brand.find({ brand_hide: 0 }).sort({ brand_name: 1 })

        const sql_brand_relation = await brandRelationMaster.find({ product_id: productId, brand_type: 'catalog' })
        // console.log("sql_brand_relation",sql_brand_relation);
        const brandIds = sql_brand_relation.filter(doc => doc && doc.brand_id).map(doc => doc.brand_id.toString());
        /*  const brandId = sql_brand_relation.map(doc => {
             console.log("doc", doc);
             return doc.brand_id;
         }); */
        // console.log("brandIds",brandIds);

        const size = await Size.find({ size_hide: 0 }).sort({ _id: 1 })

        const sql_size_relation = await sizerelationMaster.find({ product_id: productId, size_type: 'catalog' })
        // console.log("sql_size_relation.Length",sql_size_relation.length);
        const totalsize = sql_size_relation.length + 1;

        let num = 1;


        /*   if (sql_size_relation.length === 0) {
              sql_size_relation.push({
                  num: num++,
                  size_id: '',
                  size_qty: '',
                  product_price: '',
                  sizes: size
              });
          } else {
              sql_size_relation.forEach(doc => {
                  doc.num = num++;
                  doc.sizes = size;
              });
          } */

        sql_size_relation.forEach(doc => {
            doc.num = num++ // Increment the counter
            doc.sizes = size;
        });

        /*  if (sql_size_relation.length === 0) {
             sql_size_relation.push({
                 num: num++,
                 size_id: '',
                 size_qty: '',
                 product_price: '',
                 sizes: size
             });
         } */

        count_rows = sql_subimage.length + 1;
        sql_subimage.forEach(image => {
            image.subimage = image.subimage.replace(/\\/g, '/');
        });

        const count = await attributeRelation.countDocuments({ product_id: productId });

       /*  var x;
        await attribute.findOne().then((data) => {
            x = data;
        }); */

            const  aggregateQuery =([
                {
                    $match: {
                        product_id: productId
                    }
                },
                {
                    $lookup: {
                        from: "attribute_masters",
                        localField: "attribute_name",
                        foreignField: "attribute_name",
                        as: "attribute_info"
                    }
                },
                {
                    $unwind: "$attribute_info"
                },
                {
                    $group: {
                        _id: "$attribute_name",
                        attval: { $push: "$attribute_value" },
                        attribute_id: { $first: "$attribute_info._id" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        attribute_name: "$_id",
                        // attval: { $arrayElemAt: ["$attval", 0] },
                        attval: { $reduce: {
                            input: "$attval",
                            initialValue: "",
                            in: { $concat:[
                                { $cond: [ { $eq: [ "$$value", "" ] }, "", { $concat: [ "$$value", "," ] } ] }, "$$this"]}}},
                        attribute_id: 1
                    }
                }

            ]);

                   const cursor = attributeRelation.aggregate(aggregateQuery);
                   const sql_attribute = await cursor;


               /*  var  fetch_subattribute1 = [];
                  for (let i =0; i < sql_attribute.length; i++) {
                    const attribute_id = sql_attribute[i].attribute_id;
                    const attribute_name = sql_attribute[i].attribute_name;

                    const subattributes = await subattribute.find({attribute_id});
                    // const subAttribute = JSON.stringify(subattributes)
                    //const subattributeNames = subattributes.map(sub =>fetch_subattribute1.push(sub));
                    fetch_subattribute1[attribute_name]=subattributes;
                    sql_attribute[i]["fetch_attr"]=fetch_attr;
                    sql_attribute[i]["fetch_subattribute"]=subattributes;
                  } */
                  //console.log("fetch_subattribute1",fetch_subattribute1);
                   let num1 = 1;

                  sql_attribute.forEach(async doc => {

                    const attribute_id = doc.attribute_id;
                    const subattributes = await subattribute.find({attribute_id});
                    doc.num1 = num1++;
                    doc.fetch_attr = fetch_attr;
                    doc.fetch_subattribute = subattributes;

                });


        res.render("retail_admin/views/product_edit", {
            sql_product,
            sql_subimage,
            sql_relation_cat,
            sql_relation_subcat,
            sql_brand_relation,
            size,
            sql_size_relation,
            category,
            brand,
            count_rows,
            typeIds,
            subtypeIds,
            disableDate,
            pushtotopDate,
            brandIds,
            totalsize,
            fetch_attr,
            fetch_subattr,
            fetch_subattribute,
            sql_attribute,
            num,
            num1,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

const updateproduct = async (req, res) => {

    try {

        const productId = req.params.id;
        const selected_cat = req.body['selected_cat[]'];
        const selected_subcat = req.body['selected_subcat[]'];
        const product_type1 = req.body.product_type;
        const product_hsn = req.body.product_hsn;
        const product_name = req.body.product_name;
        const cname = req.body.cname;
        /* const selected_brand = req.body['selected_brand[]'];
        console.log("selected_brand",selected_brand); */
        const selected_brand = Array.isArray(req.body['selected_brand[]']) ? req.body['selected_brand[]'] : [req.body['selected_brand[]']];

        const mrp_price = req.body['mrp_price[]'];
        const product_price = req.body['product_price[]'];
        const product_reseller_price = req.body['product_reseller_price'];
        const catalog_pcs = req.body['catalog_pcs[]'];
        const product_gst = req.body['product_gst[]'];
        const product_weight = req.body.product_weight;
        const product_stitch = req.body.product_stitch;
        const video_link = req.body['video_link[]'];

        const pushtotopdate = req.body.product_date;
        const pushtotopDate = format(pushtotopdate, 'yyyy-MM-dd');

        const product_quantity = req.body.product_quantity;

        var product_size = [];
        product_size = req.body['product_size1[]'];
        let product_quantity1 = req.body['product_quantity1[]'];
        var size_price1 = [];
        size_price1 = req.body['size_price1[]'];

        const date = new Date().toISOString().slice(0, 10);
        const disable_date = req.body.disable_date;
        if (disable_date !== undefined && disable_date !== null && disable_date !== '') {
            const disableDate = new Date().toISOString().replace(/:/g, '-');
        }

       /*  const product_attributenew = req.body['product_attributea1[]'];
        console.log("product_attributenew",product_attributenew);
        const product_subattribute = req.body['product_subattribute1[]'];
        console.log("product_subattribute",product_subattribute); */

        const total_attribute1 = req.body.total_attribute1;

        var product_attribute1  = [];
        var product_subattribute1  = [];

       /*  for (i = 1; i < total_attribute1; i++) {
            const product_attribute2 = req.body['product_attributea1[' + i + '][]'];

            product_attribute1.push(product_attribute2);

            var product_subattribute2 = req.body['product_subattribute1[' + i + '][]'];

            if (!Array.isArray(product_subattribute2)) {
                product_subattribute2 = [product_subattribute2];
            }

            product_subattribute1.push(product_subattribute2);
        } */

            for (const key in req.body) {
                if (key.startsWith('product_attributea1')) {
                    product_attribute1.push(req.body[key]);
                }

                if (key.startsWith('product_subattribute1')) {
                    product_subattribute1.push(req.body[key]);
                }
            }

        const product_short_description = req.body.product_short_description;
        const product_full_description = req.body.product_full_description;
        const product_meta_title = req.body.product_meta_title;
        const product_meta_keyword = req.body.product_meta_keyword;
        const product_meta_desc = req.body.product_meta_desc;
        const editor = req.body.editor;
        const pushtotop = req.body['product_date[]'];
        const notes = req.body.notes;
        const total = req.body.total;
        const upcoming_checkbox = req.body.upcoming_checkbox;
        // console.log("upcoming_checkbox", upcoming_checkbox);

        const author_name = 'Gajendra Bhamare';
        const totalCatalogPrice = parseInt(product_price) * parseInt(catalog_pcs);
        const totalCatalogPriceReseller = parseInt(product_reseller_price) * parseInt(catalog_pcs);

        // const subimages = req.files['subimage_file1[]'];
        const subimages = req.files && req.files['subimage_file1[]'] ? req.files['subimage_file1[]'] : null;
        // console.log("Subimageeeesss"+JSON.stringify(subimages))

        let subimage1;
        /*  if (Array.isArray(subimages)) {
             subimage1 = subimages;
         } else {
             subimage1 = [subimages];
         } */

        if (Array.isArray(subimages)) {
            subimage1 = subimages;
            // console.log("subimage1.length1",subimage1);
        } else if (subimages) {
            subimage1 = [subimages];
            // console.log("subimage1.length1",subimage1);
        } else {
            subimage1 = [];
        }

        const size_checkbox = req.body['size_checkbox[]']
        const datetime = new Date().toISOString().slice(0, 10);

        let product_seo_url = product_name.toLowerCase();
        product_seo_url = product_seo_url.replace(/[^a-z0-9\-]/g, '-');
        product_seo_url = product_seo_url.replace(/-+/g, '-');
        let newNamePath1 = '';
        const product_image = req.files && req.files.image_file;

        if (product_image) {

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
            newNamePath1 = path.join(monthFolder1, newName);
            await product_image.mv(newNamePath);
        }

        if (size_checkbox == "on") {

            if (!Array.isArray(product_quantity1)) {
                product_quantity1 = [product_quantity1];
            }

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

        if (upcoming_checkbox == "on") {
            upcoming = 1;
        } else {
            upcoming = 0;
        }


        let updateFields = {};

        if (!product_image) {

            if (product_hsn) updateFields.product_hsn = product_hsn;
            if (product_name) updateFields.product_name = product_name;
            if (cname) updateFields.cname = cname;
            if (product_seo_url) updateFields.product_seo_url = product_seo_url;
            if (quantity) updateFields.product_qty = quantity;
            if (catalog_pcs) updateFields.catalog_pcs = catalog_pcs;
            if (product_price) updateFields.product_price = product_price;
            if (mrp_price) updateFields.product_mrp_price = mrp_price;
            if (totalCatalogPrice) updateFields.product_sale_price = totalCatalogPrice;
            if (totalCatalogPriceReseller) updateFields.product_reseller_sale_price = totalCatalogPriceReseller;
            if (product_gst) updateFields.product_gst = product_gst;
            if (product_weight) updateFields.product_weight = product_weight;
            if (product_stitch) updateFields.product_stitch = product_stitch;
            if (product_short_description) updateFields.product_short_description = product_short_description;
            if (product_full_description) updateFields.product_full_description = product_full_description;
            if (product_meta_title) updateFields.product_meta_title = product_meta_title;
            if (product_meta_keyword) updateFields.product_meta_keyword = product_meta_keyword;
            if (product_meta_desc) updateFields.product_meta_description = product_meta_desc;
            if (disable_date) updateFields.disable_date = disable_date;
            if (upcoming) updateFields.upcoming = upcoming;
            if (product_type1) updateFields.product_type = product_type1;
            if (editor) updateFields.other_detail = editor;
            if (video_link) updateFields.video_link = video_link;
            if (pushtotopDate) updateFields.push_to_top_date = pushtotopDate;
            if (notes) updateFields.note = notes;

        } else {

            if (product_hsn) updateFields.product_hsn = product_hsn;
            if (product_name) updateFields.product_name = product_name;
            if (product_seo_url) updateFields.product_seo_url = product_seo_url;
            if (product_image) updateFields.product_image = newNamePath1;
            if (quantity) updateFields.product_qty = quantity;
            if (catalog_pcs) updateFields.catalog_pcs = catalog_pcs;
            if (product_price) updateFields.product_price = product_price;
            if (mrp_price) updateFields.product_mrp_price = mrp_price;
            if (totalCatalogPrice) updateFields.product_sale_price = totalCatalogPrice;
            if (totalCatalogPriceReseller) updateFields.product_reseller_sale_price = totalCatalogPriceReseller;
            if (product_gst) updateFields.product_gst = product_gst;
            if (product_weight) updateFields.product_weight = product_weight;
            if (product_stitch) updateFields.product_stitch = product_stitch;
            if (product_short_description) updateFields.product_short_description = product_short_description;
            if (product_full_description) updateFields.product_full_description = product_full_description;
            if (product_meta_title) updateFields.product_meta_title = product_meta_title;
            if (product_meta_keyword) updateFields.product_meta_keyword = product_meta_keyword;
            if (product_meta_desc) updateFields.product_meta_description = product_meta_desc;
            if (disable_date) updateFields.disable_date = disable_date;
            if (upcoming) updateFields.upcoming = upcoming;
            if (product_type1) updateFields.product_type = product_type1;
            if (editor) updateFields.other_detail = editor;
            if (video_link) updateFields.video_link = video_link;
            if (pushtotopDate) updateFields.push_to_top_date = pushtotopDate;
            if (notes) updateFields.note = notes;

        }

        const updatedProduct = await product_master.findByIdAndUpdate(productId, updateFields, { new: true });

        if (updatedProduct) {

            await relationMaster.deleteMany({ product_id: productId, type: 'cat' });

            if (Array.isArray(selected_cat)) {
                if (selected_cat.length > 0) {
                    const saveRelations = async () => {
                        try {
                            for (const cat_id of selected_cat) {
                                const catRelation = new relationMaster({
                                    product_id: productId,
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
                    product_id: productId,
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

            await relationMaster.deleteMany({ product_id: productId, type: 'subcat' });

            if (Array.isArray(selected_subcat)) {
                if (selected_subcat.length > 0) {
                    const saveRelations = async () => {
                        try {
                            for (const subcat_id of selected_subcat) {
                                const subcatRelation = new relationMaster({
                                    product_id: productId,
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
                    product_id: productId,
                    type_id: selected_subcat,
                    type: 'subcat'
                });
                try {
                    await subcatRelation.save();

                } catch (error) {
                    console.error('Error saving single subcategory relation:', error);
                }
            }

            const branddelete = await brandRelationMaster.deleteMany({ product_id: productId, brand_type: 'catalog' });

            if (selected_brand && (Array.isArray(selected_brand) ? selected_brand : selected_brand)) {
                // || typeof selected_brand === 'string'
                for (const brandId of selected_brand) {

                    const newBrandRelation = new brandRelationMaster({
                        product_id: productId,
                        brand_id: brandId, // Save each brand ID individually
                        brand_type: 'catalog',
                        date: new Date()
                    });
                    await newBrandRelation.save();
                }
            }

            await sizerelationMaster.deleteMany({ product_id: productId, size_type: 'catalog' });

            if (size_checkbox == "on") {
                for (let k = 0; k < product_size.length; k++) {
                    const sizeId = product_size[k];

                    const sizeIdsConcatenated = product_size.join('');
                    const sizeObjectId = mongoose.Types.ObjectId(sizeIdsConcatenated);
                    console.log("sizeObjectId",sizeObjectId);
                    
                    const size = await Size.findById(sizeId);
                    const productSkuSize = "GB";
                    let sizePriceNew = size_price1[k];

                    if (size_price1[k] === "" || size_price1[k] === "0") {
                        sizePriceNew = product_price;
                    }

                    const sizeRelation = new sizerelationMaster({
                        size_id: sizeId,
                        catalog_id: '0',
                        product_id: productId,
                        product_sku: productSkuSize,
                        product_price: sizePriceNew,
                        size_qty: product_quantity1[k],
                        date: date,
                        size_type: 'catalog'
                    });
                    const insertsize = await sizeRelation.save();
                }
            }

            const attr_relation_delete =  await attributeRelation.deleteMany({ product_id: productId });

            if (product_attribute1.length > 0) {
                for (let key = 0; key < product_attribute1.length; key++) {
                    const attributevalue = product_attribute1[key];
                    const fetch_attribute = await attribute.findOne({ _id: attributevalue }).sort({ attribute_name: 1 });
                    if (fetch_attribute) {
                        const attribute_name = fetch_attribute.attribute_name;

                        const subAttributes = Array.isArray(product_subattribute1[key]) ? product_subattribute1[key] : [product_subattribute1[key]];

                        for (let k = 0; k < subAttributes.length; k++) {
                            const attributeValue = subAttributes[k];
                            const insertattribute = new attributeRelation({
                                attribute_name: attribute_name,
                                product_id: productId,
                                attribute_value: attributeValue,
                            })
                            const insertrelarion = await insertattribute.save();
                        }
                    }
                }
            }

            const subimages = await productSubimage.find({ product_id: productId, subimage_type: 'catalog' })

            let sub_array = [];
            let sub_id_2 = [];
            subimages.forEach(image => {
                image.subimage = image.subimage.replace(/\\/g, '/');
            });

            subimages.forEach(sub_data => {
                var sub_array1 = sub_data.subimage;
                var parts1 = sub_array1.split('/');
                var parts2 = parts1[parts1.length - 1];
                /*  console.log("sub_array1=",parts1);
                 console.log("parts1=",parts1);
                 console.log("parts2=",parts2); */
                sub_array.push(parts2);
                sub_id_2.push(sub_data._id.toString());
            });


            /* console.log("sub_id_2",sub_id_2); */
            if (subimage1.length > 0) {
                let sub_id_1 = [];
                /* console.log("subimage1len=",subimage1.length); */
                for (let k = 0; k < subimage1.length; k++) {

                    if (subimage1[k] !== null) {
                        const image = subimage1[k];
                        const datetime = new Date().toISOString().replace(/:/g, '_');
                        const ext = path.extname(image.name);

                        const basePath = './public/images/product/sub_images/'
                        const basePath1 = '/images/product/sub_images/'
                        const year_folder = path.join(basePath, new Date().getFullYear().toString());
                        const year_folder1 = path.join(basePath1, new Date().getFullYear().toString());
                        const month_folder = path.join(year_folder, (new Date().getMonth() + 1).toString());
                        const month_folder1 = path.join(year_folder1, (new Date().getMonth() + 1).toString());

                        /* const new_name = ${product_seo_url}-${k}-${datetime}${ext} */
                        const newName = `${product_seo_url}-${datetime}${ext}`;
                        /* const new_name1 = path.join(month_folder, `${product_seo_url}-${k}-${datetime}${ext}`); */
                        const newNamePath = path.join(month_folder, newName);
                        const newNamePath1 = path.join(month_folder1, newName);


                        if (!fs.existsSync(year_folder)) fs.mkdirSync(year_folder, { recursive: true });
                        if (!fs.existsSync(month_folder)) fs.mkdirSync(month_folder, { recursive: true });

                        const type = "catalog";
                        const index = sub_array.indexOf(image.name);
                        /* console.log("sub_array=",sub_array);
                        console.log("image=",image);
                        console.log("index=",index); */
                        if (index !== -1) {
                            const subimage_id = sub_id_2[index];
                            sub_id_1.push(subimage_id);

                        } else {
                            await subimage1[k].mv(newNamePath);
                            const insertsubimage = new productSubimage({
                                product_id: productId,
                                subimage: newNamePath1,
                                subimage_date: date,
                                subimage_type: type,
                            });
                            const insertSubimage = await insertsubimage.save();
                        }
                    }
                }

                let output;

                if (sub_id_1.length > 0) {
                    let difference = sub_id_1.filter(x => !sub_id_2.includes(x));
                    let difference2 = sub_id_2.filter(x => !sub_id_1.includes(x));
                    outputmerge = difference.concat(difference2);
                    output = outputmerge

                } else {
                    output = sub_id_2
                }
                /* console.log("output",output); */

                const objectIdArray = output.map(_id => new ObjectId(_id.trim()));
                /*  console.log('objectIdArray:', objectIdArray); */

                const deletesubimage = await productSubimage.deleteMany({ product_id: productId, subimage_type: 'catalog', _id: { $in: objectIdArray } });
                /* console.log("deletesubimage",deletesubimage); */
            }
            res.redirect('/retail_admin/product_view')
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

const quickproduct = async (req, res) => {
    const productId = req.params.id;
    //console.log("productId", productId);
    res.send("Connect Successfull...")

}
const quickproduct1 = async (req, res) => {

    const productId = req.params.id;
    const sql_product = await product_master.findOne({ _id: productId })

    const date = new Date(sql_product.disable_date);
    const disableDate = format(date, 'yyyy-MM-dd');

    const pushtotopdate = new Date(sql_product.push_to_top_date);
    const pushtotopDate = format(pushtotopdate, 'yyyy-MM-dd');

    const sql_subimage = await productSubimage.find({ product_id: productId, subimage_type: 'catalog' })

    const category = await Category.find();

    const sql_relation_cat = await relationMaster.find({ product_id: productId, type: 'cat' })

    const typeIds = sql_relation_cat.map(doc => doc.type_id);

    const sql_relation_subcat = await relationMaster.find({ product_id: productId, type: 'subcat' })
    const subtypeIds = sql_relation_subcat.map(doc => doc.type_id);

    const brand = await Brand.find({ brand_hide: 0 }).sort({ brand_name: 1 })

    const sql_brand_relation = await brandRelationMaster.find({ product_id: productId, brand_type: 'catalog' })

    const brandIds = sql_brand_relation.filter(doc => doc.brand_id).map(doc => doc.brand_id.toString());

    const size = await Size.find({ size_hide: 0 }).sort({ _id: 1 })

    const sql_size_relation = await sizerelationMaster.find({ product_id: productId, size_type: 'catalog' })

    const totalsize = sql_size_relation.length + 1;

    let num = 1;

    sql_size_relation.forEach(doc => {
        doc.num = num++
        doc.sizes = size;
    });

    count_rows = sql_subimage.length + 1;
    sql_subimage.forEach(image => {
        image.subimage = image.subimage.replace(/\\/g, '/');
    });

    const jdata = {
        sql_product,
        sql_subimage,
        sql_relation_cat,
        sql_relation_subcat,
        sql_brand_relation,
        size,
        sql_size_relation,
        category,
        brand,
        count_rows,
        typeIds,
        subtypeIds,
        disableDate,
        pushtotopDate,
        brandIds,
        totalsize,
    }
    res.json(jdata);
    /*  res.render("product_view",{
         sql_product,
         sql_subimage,
         sql_relation_cat,
         sql_relation_subcat,
         sql_brand_relation,
         size,
         sql_size_relation,
         category,
         brand,
         count_rows,
         typeIds,
         subtypeIds,
         disableDate,
         pushtotopDate,
         brandIds,
         totalsize,
     }); */
}

const quickproductupdate = async (req, res) => {

    const productId = req.body.product_id;

    const total_size = req.body.total_size;

    const product_quantity = req.body.product_quantity;

    const product_quantity1 = req.body.product_quantity1;

    const product_size = req.body.product_size1;

    const size_price1 = req.body.size_price1;

    const product_type = req.body.product_type;
    const disable_date = req.body.disable_date;
    const product_date = req.body.product_date;
    const date = new Date().toISOString().slice(0, 10);
    const size_checkbox = req.body.size_checkbox;

    if (size_checkbox == "on") {

        if (!Array.isArray(product_quantity1)) {
            product_quantity1 = [product_quantity1];
        }

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
    let updateField = {};
    if (quantity) updateField.product_qty = quantity;
    if (disable_date) updateField.disable_date = disable_date;
    if (product_type) updateField.product_type = product_type;
    if (product_date) updateField.push_to_top_date = product_date;

    const updatedProductquick = await product_master.findByIdAndUpdate(productId, updateField, { new: true });

    if (updatedProductquick) {
        await sizerelationMaster.deleteMany({ product_id: productId, size_type: 'catalog' });

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
                    product_id: productId,
                    product_sku: productSkuSize,
                    product_price: sizePriceNew,
                    size_qty: product_quantity1[k],
                    date: date,
                    size_type: 'catalog'
                });
                const insertsize = await sizeRelation.save();
            }
        }
        res.redirect('/retail_admin/product_view');
    }
}

module.exports = {
    getproductpage,
    updateproduct,
    quickproduct,
    quickproduct1,
    quickproductupdate,

}