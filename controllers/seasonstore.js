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

    for(i=0;i<fileInputs.length;i++){
        const image = req.files['image_files['+ i+ ']'];
        console.log("image",image);
    }


console.log("req.body",req.body);

}

module.exports = {
    getadminseason,
    addadminseason,
}