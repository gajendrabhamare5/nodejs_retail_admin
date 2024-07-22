
const getcontactusInfo = async (req, res) => {
    res.render("contactus")
}

const insertcontactusInfo = async (req,res) => {
    console.log("req.body",req.body);
}

module.exports = {
    getcontactusInfo,
    insertcontactusInfo,

}