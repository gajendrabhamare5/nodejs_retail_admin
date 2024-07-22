
const cnumber = require("../models/contact_number");

const getcnumberInfo = async (req, res) => {
    try {
        const getcnumber = await cnumber.find()
        res.render("retail_admin/views/contact_number", { getcnumber });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

const updatecnumber = async (req, res) => {
    try {

        const { line_1, line_2, line_3, line_4, line_5 } = req.body;

        //console.log("req.body", req.body);

        let cnumberData = await cnumber.findOne();
        if (cnumberData) {
            // Update existing record
            cnumberData.line_1 = line_1;
            cnumberData.line_2 = line_2;
            cnumberData.line_3 = line_3;
            cnumberData.line_4 = line_4;
            cnumberData.line_5 = line_5;
            const updatecnumber = await cnumberData.save();

        } else {

            // Insert new record
            cnumberData = new cnumber({
                line_1,
                line_2,
                line_3,
                line_4,
                line_5,
            });
            const savecnumber = await cnumberData.save();

        }
        res.redirect('/retail_admin/contact_number')

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}



module.exports = {
    getcnumberInfo,
    updatecnumber,
}