const seasonStore = require("../models/seasonstore")
const getadminseason = async (req,res)=>{
    const getdata = await seasonStore.find()
    let num = 1;
    getdata.forEach(doc => {
        doc.num = num++ // Increment the counter
    });
    res.render("retail_admin/views/season_store_add",{getdata,num});
}

module.exports = {
    getadminseason,
}