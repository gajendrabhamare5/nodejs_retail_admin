const getdealer = async (req, res) => {

    res.render("retail_admin/views/dealer_add");
}

const adddealer = async(req,res)=>{
    const dealer = req.body;

    

}

module.exports= {
    adddealer,
    getdealer,
}
