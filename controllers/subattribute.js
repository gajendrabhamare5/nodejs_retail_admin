const attributeRelation = require("../models/attribute_relation_master");
const attribute = require("../models/attribute");
const subattribute = require("../models/sub_attribute_master");

const getsubattribute = async (req, res) => {
    try {
        const attributeData = await attribute.find();
        const sqlData = await subattribute.find();

        let num = 0;
        const data_subattr = [];

        for (const fetch of sqlData) {

            const id = fetch._id;
            const attribute_id = fetch.attribute_id;
            const sub_attribute_name = fetch.sub_attribute_name;
            const sub_attribute_metatitle = fetch.sub_attribute_metatitle
            const sub_attribute_metakey = fetch.sub_attribute_metakey
            const sub_attribute_metadesc = fetch.sub_attribute_metadesc

            const sql = await attribute.findOne({ _id: attribute_id })
            if (sql) {
                attribute_name = sql.attribute_name;
            }
            num++;

            const data1 = {
                id: id,
                no: num,
                attribute_name: attribute_name,
                sub_attribute_name: sub_attribute_name,
                sub_attribute_metatitle, sub_attribute_metatitle,
                sub_attribute_metakey: sub_attribute_metakey,
                sub_attribute_metadesc: sub_attribute_metadesc,
            }
            data_subattr.push(data1);

        }

        const results = {
            sEcho: 1,
            iTotalRecords: data_subattr.length,
            iTotalDisplayRecords: data_subattr.length,
            aaData: data_subattr,
        };


        res.render("retail_admin/views/sub_attribute", { attributeData, subattrData: data_subattr });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

const addSubattribute = async (req, res) => {
    try {

        const attribute_id = req.body.attribute_id;
        const sub_attribute_name = req.body.sub_attribute_name;
        const sub_attribute_metakey = req.body.sub_attribute_metakey;
        const sub_attribute_metatitle = req.body.sub_attribute_metatitle;
        const sub_attribute_metadesc = req.body.sub_attribute_metadesc;

        const result = await subattribute.find({ sub_attribute_name: sub_attribute_name });

        if (result.length > 0) {
            res.send("error")
        } else {

            const newSubattribute = new subattribute({

                attribute_id: attribute_id,
                sub_attribute_name: sub_attribute_name,
                sub_attribute_metatitle: sub_attribute_metatitle,
                sub_attribute_metakey: sub_attribute_metakey,
                sub_attribute_metadesc: sub_attribute_metadesc,
                sub_attribute_delete: '0',
            })

            const insertSubattribute = await newSubattribute.save();

            if (insertSubattribute) {
                res.send("ok");
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

const deletesubattribute = async (req, res) => {
    try {
        const subattrid = req.params.id;
        const result = await subattribute.findByIdAndDelete(subattrid);
        res.send("ok");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

const subattributegetinfo = async (req, res) => {
    try {

        const subattrId = req.params.id;

        const attributes = await attribute.find();

        const subattributes = await subattribute.findById(subattrId);

        if (!subattributes) {
            return res.status(404).json({ error: 'Sub category not found' })
        }

        res.render("subattribute_edit", { subattributes, attributes });

    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).send("Database query error");
    }
}

const subattributeupdate = async (req, res) => {

    const attr_id = req.body.attribute_id;
    const subattrId = req.body.id;
    const subattribute_name = req.body.sub_attribute_name;
    const subattribute_metakey = req.body.sub_attribute_metakey;
    const subattribute_metatitle = req.body.sub_attribute_metatitle;
    const subattribute_metadesc = req.body.sub_attribute_metadesc;

    const updateData = await subattribute.find({ sub_attribute_name: subattribute_name, _id: { $ne: subattrId } });

    if (updateData.length > 0) {
        res.send("error");
    } else {
        const updateData1 = await subattribute.find({ _id: subattrId });
        if (updateData1.length > 0) {

            for (const fetch of updateData1) {
                const sub_attribute_name_old = fetch.sub_attribute_name;
                const attribute_id_old = fetch.attribute_id;
                let att_name = "";
                if (attribute_id_old !== attr_id) {
                    const checkResult = await attribute.find({ _id: attr_id });
            if (checkResult.length > 0) {
                const attribute_name_old = checkResult.attribute_name;
                att_name = `, attribute_name : '${attribute_name_old}'`;
            }

                }

                const updateattributeRelation = await attributeRelation.updateMany(
                    { attribute_value: sub_attribute_name_old },
                    { $set: {
                        attribute_name: subattribute_name,
                       att_name
                    }}
                )

                const updatesubattribute = await subattribute.updateMany(
                    { _id: subattrId },
                    {
                        $set: {
                            attribute_id: attr_id,
                            sub_attribute_name: subattribute_name,
                            sub_attribute_metakey: subattribute_metakey,
                            sub_attribute_metatitle: subattribute_metatitle,
                            sub_attribute_metadesc: subattribute_metadesc,

                        }
                    },
                )

                if(updatesubattribute){
                    res.send("ok");
                }

            }

        }
    }

}

const subattributepop = async (req,res)=>{

    const attribute_name = req.body.attribute_name;
    const sub_attribute_name = req.body.sub_attribute_name;

    const chk_sql = await subattribute.find({sub_attribute_name:sub_attribute_name});
    if(chk_sql.length > 0 ){
        res.status(400).send({ status: 'error', message: '' });

    }else{

        const newSubattribute = new subattribute({

            attribute_id: attribute_name,
            sub_attribute_name: sub_attribute_name,

        })

        const insertSubattribute = await newSubattribute.save();

        if(insertSubattribute){
            res.send({ status: 'ok', message: '' });
        }
    }


}

const proattribute = async (req,res)=>{
    const nameid = req.body.datapost;
    const result = await subattribute.find({ attribute_id : nameid });
    let optionsHtml = '';
    result.forEach(subAttribute => {
        optionsHtml += `<option value="${subAttribute.sub_attribute_name}">${subAttribute.sub_attribute_name}</option>`;
    });

    res.send(optionsHtml);

}

module.exports = {
    getsubattribute,
    addSubattribute,
    deletesubattribute,
    subattributegetinfo,
    subattributeupdate,
    subattributepop,
    proattribute,
}