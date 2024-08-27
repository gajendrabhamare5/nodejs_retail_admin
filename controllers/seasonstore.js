const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const seasonStore = require("../models/seasonstore");
const { response } = require('express');

const getadminseason = async (req, res) => {
    const getdata = await seasonStore.find()
    let num = 1;
    getdata.forEach(doc => {
        doc.num = num++ // Increment the counter
    });
    res.render("retail_admin/views/season_store_add", { getdata, num });
}

const addadminseason = async (req, res) => {
    const { url_array, title_array, fileInputs } = req.body;

    var url_array_split = url_array.split(",");
    var title_array_split = title_array.split(",");
    // console.log("url_array_split",url_array_split);
    // console.log("title_array_split",title_array_split);

    for (i = 0; i < fileInputs; i++) {

        var image = req.files['image_files[' + i + ']'];
        const title = title_array_split[i] || '';
        const url = url_array_split[i] || '';
        const date = new Date();

        const datetime = new Date().toISOString().replace(/:/g, '-');
        const ext = path.extname(image.name);

        const basePath = './public/images/season_store/'
        const basePath1 = '/images/season_store/'
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
            const season = new seasonStore({
                url: url,
                title: title,
                slider_image: newNamePath1,
                date,
            });

            const savedSeason = await season.save();
            res.send({ status: 'ok', message: 'Inserted successfully' });
        } catch (err) {
            console.error('Data Inserted failed:', err);
            res.status(500).send({ status: 'error', message: 'Data inserted failed.' });
        }

    }



}

const editadminseason = async (req, res) => {

    const { url, title, id } = req.body;
    const image =   req.files ? req.files['image_file']: null;
    const date = new Date();

    let updateFields = {};

    if (!image) {
        if (url) updateFields.url = url;
        if (title) updateFields.title = title;
        if (date) updateFields.date = date;
    } else {


        const datetime = new Date().toISOString().replace(/:/g, '-');
        const ext = path.extname(image.name);

        const basePath = './public/images/season_store/'
        const basePath1 = '/images/season_store/'
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

        if (url) updateFields.url = url;
        if (title) updateFields.title = title;
        if (image) updateFields.slider_image = newNamePath1;
        if (date) updateFields.date = date;

    }

    try {
        const updatedseason = await seasonStore.findByIdAndUpdate(id, updateFields, { new: true });

        res.send({ status: 'success', message: 'Update successful' });

    } catch (err) {
        console.error('Database update failed:', err);
        res.status(500).send({ status: 'error', message: 'Database update failed.' });
    }


}

const deleteadminseason = async (req,res) =>{
    // const id = req.params.id;
    const seaid = req.params.id;
    console.log("id",seaid);
    if (!seaid) {
        res.send({ status: 'error', message: 'Something is wrong' })
    } else {
        const result = await seasonStore.deleteOne({ _id: seaid });
        res.send({status:'ok'});
    }

}

module.exports = {
    getadminseason,
    addadminseason,
    editadminseason,
    deleteadminseason,
}