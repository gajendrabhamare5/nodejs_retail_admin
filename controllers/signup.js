const getsignupInfo = async (req, res) => {
    //const faqData = await faq.findOne();
    res.render("web/views/signup")
}

module.exports= {
    getsignupInfo,
}