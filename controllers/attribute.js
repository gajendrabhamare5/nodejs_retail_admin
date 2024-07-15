const attribute = require("../models/attribute");
const attributeRelation = require("../models/attribute_relation_master");

const getattribute = async (req,res)=>{
    try {

        const sqlData = await attribute.find();
        let num = 0;
        const data_attr = [];

        for (const fetch of sqlData) {
            const id = fetch._id;

            const att_name = fetch.attribute_name;
            const attribute_metakey=  fetch.attribute_metakey;
            const attribute_metatitle = fetch.attribute_metatitle
            const attribute_metadesc= fetch.attribute_metadesc
            num++;

            const data1 = {
                id:id,
                no: num,
                att_name:att_name,
                attribute_metakey,attribute_metakey,
                attribute_metatitle:attribute_metatitle,
                attribute_metadesc:attribute_metadesc
            }
            data_attr.push(data1);

        }

        const results = {
            sEcho: 1,
            iTotalRecords: data_attr.length,
            iTotalDisplayRecords: data_attr.length,
            aaData: data_attr,
        };


        res.render("attribute",{attributes :data_attr });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

const addattribute = async (req,res)=>{
    try {

        const att_name = req.body.attribute_name;
        const attribute_metakey = req.body.attribute_metakey;
        const attribute_metatitle = req.body.attribute_metatitle;
        const attribute_metadesc = req.body.attribute_metadesc;
        const filter_checkbox = req.body.filter_checkbox;

        if(filter_checkbox == "on"){
                 filter = 1;
        }else{
             filter = 0;
        }

        const result = await attribute.find({attribute_name :att_name});

        if(result.length > 0){
            res.send("error")
        }else{

            const newattribute = new attribute({
                attribute_name: att_name,
                attribute_metakey: attribute_metakey,
                attribute_metatitle : attribute_metatitle,
                attribute_metadesc: attribute_metadesc,
                filter: filter,
            })

            const insertattribute = await newattribute.save();

            if(insertattribute){
                res.send("ok");
            }
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

const deleteattribute = async (req,res)=>{

try {
    const attrid = req.params.id;
    const result = await attribute.findByIdAndDelete(attrid);
    res.send("ok");

} catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error")
}

}

const attributegetinfo = async (req,res)=>{
    try {
        // console.log(" in category edit info ");
        const attrId = req.params.id;

        const attributes = await attribute.findById(attrId);

        if (!attributes) {
            return res.status(404).json({ error: 'Category not found' })
        }

        res.render("attribute_edit", { attributes });

    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).send("Database query error");
    }
}

const attributeupdate = async (req,res) =>{
try {

    const attrId = req.body.id;
    const attribute_name = req.body.attribute_name;
    const attribute_metakey = req.body.attribute_metakey;
    const attribute_metatitle = req.body.attribute_metatitle;
    const attribute_metadesc = req.body.attribute_metadesc;
    const filter_checkbox = req.body.filter_checkbox;

    const updateData = await attribute.find({ attribute_name:attribute_name, _id : {$ne : attrId }});

    if(updateData.length > 0){
        res.send("error")
    }else{

        const updateData1 = await attribute.find({ _id:attrId});
        if(updateData1.length > 0 ){

            for (const fetch of updateData1) {
                const attr_name_old = fetch.attribute_name;

                const updateattributeRelation = await attributeRelation.updateMany(
                    { attribute_name: attr_name_old },
                    { $set: {
                        attribute_name: attribute_name,
                    }}
                )


            const updateattribute = await attribute.updateMany(
                { _id: attrId },
                {
                    $set: {
                        attribute_name: attribute_name,
                        attribute_metakey: attribute_metakey,
                        attribute_metatitle: attribute_metatitle,
                        attribute_metadesc: attribute_metadesc,
                        filter: filter_checkbox
                    }
                },
            )


            if(updateattribute){
                res.send("ok");
            }

            }
        }

    }


} catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error")
}
}

module.exports = {
    getattribute,
    addattribute,
    deleteattribute,
    attributegetinfo,
    attributeupdate,

}

