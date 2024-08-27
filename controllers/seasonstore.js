const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const seasonStore = require("../models/seasonstore")
const getadminseason = async (req,res)=>{
    const getdata = await seasonStore.find()
    let num = 1;
    getdata.forEach(doc => {
        doc.num = num++ // Increment the counter
    });
    res.render("retail_admin/views/season_store_add",{getdata,num});
}

const addadminseason = async (req,res) =>{
    const {url_array,title_array,fileInputs} = req.body;

    var url_array_split = url_array.split(",");
    var title_array_split = title_array.split(",");
    // console.log("url_array_split",url_array_split);
    // console.log("title_array_split",title_array_split);

    for(i=0;i<fileInputs;i++){

        var image = req.files['image_files['+ i +']'];
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

       const season = new seasonStore({
        url: url,
        title: title,
        slider_image: newNamePath1,
        date,
    });

    const savedSeason = await season.save();

    }

    res.send('ok');

}

const editadminseason = async (req,res) => {

    

}

module.exports = {
    getadminseason,
    addadminseason,
    editadminseason,
}