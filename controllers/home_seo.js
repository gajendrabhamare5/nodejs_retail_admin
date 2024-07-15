/* const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); */
const Seo = require("../models/home_seo");

const getSeoInfo = async (req,res)=>{
    try {
        const getseo = await Seo.find()
        console.log(getseo);
        res.render("home_seo", { getseo });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

const updateSeo = async (req,res) => {
    try {

const { content, tital, keyword, discription } = req.body;

console.log("req.body",req.body);

        let seoData = await Seo.findOne();
        if (seoData) {
            // Update existing record
            seoData.content = content;
            seoData.tital = tital;
            seoData.keyword = keyword;
            seoData.description = discription;
           const updateseo =  await seoData.save();

        } else {
            console.log("else part called..");
            // Insert new record
            seoData = new Seo({
                content,
                tital,
                keyword,
                description:discription,
            });
           const saveseo =  await seoData.save();

        }
        res.redirect('/home_seo')

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}


module.exports = {
    getSeoInfo,
    updateSeo,
};

