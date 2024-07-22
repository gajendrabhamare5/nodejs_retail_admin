
const marquee = require("../models/marquee");

const getmarqueeInfo = async (req, res) => {
    try {
        const getmarqueeinfo = await marquee.find()
        res.render("retail_admin/views/marquee", { getmarqueeinfo })
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

const updatemarquee = async (req, res) => {
    try {

        const { content } = req.body;
        let marqueeData = await marquee.findOne();
        if (marqueeData) {
            // Update existing record
            marqueeData.content = content;

            const updatemarquee = await marqueeData.save();

        } else {
            marqueeData = new marquee({
                content,
            });
            const savemarquee = await marqueeData.save();
        }
        res.redirect('retail_admin/views/marquee');
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    getmarqueeInfo,
    updatemarquee,
}