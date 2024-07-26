const getinquiryinfo = async (req,res)=>{
   /*  try {
        const getseo = await Seo.find()

        res.render("retail_admin/views/home_seo", { getseo });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    } */
        res.render("retail_admin/views/inquiry_list");
}

module.exports = {
    getinquiryinfo,

};
