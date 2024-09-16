const getloginInfo = async (req, res) => {
    //const faqData = await faq.findOne();
    res.render("web/views/login")
}

module.exports= {
    getloginInfo,
}