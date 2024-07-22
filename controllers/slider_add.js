const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Slider = require("../models/slider_add");

const getSlider = async (req, res) => {
    try {
        const getslider = await Slider.find()
        res.render("retail_admin/views/slider_add", { getslider });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

const insertSlider = async (req, res) => {

    try {
        const { url } = req.body;
        const slider_image = req.files.image_file;


        const datetime = new Date().toISOString().replace(/:/g, '-');
        const ext = path.extname(slider_image.name);

        const basePath = './public/images/sliders/'
        const basePath1 = '/images/sliders/'
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
        await slider_image.mv(newNamePath);

        const slider = new Slider({
            url: url,
            image: newNamePath1,
        });

        const savedSlider = await slider.save();

        res.redirect('retail_admin/views/slider_add');

    } catch (error) {
        console.error(error);
        res.status(500).send("Please select image with only  JPG,PNG ,JPEG extension.");
    }

}


const sliderDelete = async (req, res) => {
    try {
        const sliderId = req.params.id;
        const result = await Slider.findByIdAndDelete(sliderId);

        if (!result) {
            return res.status(404).json({ error: 'Slider not found' });
        }

        /* res.json({ message: 'Slider deleted successfully' }); */
        res.redirect('retail_admin/views/slider_add');
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }

}

const sliderEditInfo = async (req, res) => {
    try {
        const sliderId = req.params.id;
        const slider = await Slider.findById(sliderId);

        res.render("retail_admin/views/slider_edit", { slider })

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

const updateSlider = async (req, res) => {
    try {

        const sliderId = req.params.id;
        const { url } = req.body
        const slider_image = req.files ? req.files.image_file :null;

        let updateFields = {};

        if (url) {
            updateFields.url = url;
        }

        if (slider_image && slider_image.size > 0) {

            const datetime = new Date().toISOString().replace(/:/g, '-');
            const ext = path.extname(slider_image.name)

            const basePath = './public/images/slider/'
            const basePath1 = '/images/slider/'
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

            await slider_image.mv(newNamePath);

            updateFields.image = newNamePath1;
        }

        const updatedSlider = await Slider.findByIdAndUpdate(sliderId, updateFields, { new: true });

        if (!updatedSlider) {
            return res.status(404).json({ error: 'Slider not found' });
        }

        res.redirect('retail_admin/views/slider_add');

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

module.exports = {
    getSlider,
    insertSlider,
    sliderDelete,
    sliderEditInfo,
    updateSlider,
}

