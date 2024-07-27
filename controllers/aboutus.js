const about = require("../models/aboutus");

const getaboutInfo = async (req, res) => {

    const sql_data = await about.findOne();
    // console.log("sql",sql_data);

    res.render("web/views/aboutus", { sql_data });
}

const getadminaboutinfo = async (req, res) => {

    const sql_data = await about.find();
    res.render("retail_admin/views/aboutus", { sql_data });

}

const addadminaboutinfo = async (req, res) => {
    try {

        const { section_1 } = req.body;

        let aboutData = await about.findOne();
        if (aboutData) {
            // Update existing record
            aboutData.section_2 = section_1;

            const updateaboutdata = await aboutData.save();


        } else {

            insertData = new Seo({
                section_2: section_1,

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
    getaboutInfo,
    getadminaboutinfo,
    addadminaboutinfo,
}