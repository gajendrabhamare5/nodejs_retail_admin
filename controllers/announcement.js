const announcement = require("../models/announcement")
const getadminannouncement = async (req, res) => {
    let sqldata = await announcement.find();
    res.render("retail_admin/views/announcement_slider",{sqldata})
}

const addadminannouncement = async (req,res)=>{
    try {
        const {title,url}= req.body
    let announcementdata = await announcement.findOne();

    if(announcementdata){
           /*  announcementdata.title = title;
            announcementdata.url = url;
            const updateaboutdata = await announcementdata.save(); */

            await announcement.updateOne(
                { id: 1 },
                { $set: { title: title, url: url } }
            );
            //res.json({ status: 'ok', msg: 'Successfully updated' });

    }else{

        insertData = new announcement({
            id : '1',
            title : title,
            url : url,

        });
        const savedata = await insertData.save();
    }
    res.send('ok');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

}

module.exports = {
    getadminannouncement,
    addadminannouncement,
}