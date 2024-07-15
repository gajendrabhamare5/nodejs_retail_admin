 const Size = require("../models/size")

const getsizeInfo = async (req,res)=>{
    try {

        const sqlData = await Size.find()

    let num = 0;
    const data_size = [];

    for (const fetch of sqlData) {


        let hide = fetch.size_hide;
        let hide_icon;
        if (hide == "0") {
            hide = "No";
            hide_icon = "ion-md-eye-off";
        } else if (hide == "1") {
            hide = "Yes";
            hide_icon = "ion-md-eye";
        }

        let size_hide = fetch.size_hide;
        if(size_hide == "0"){
            size_hide = "No"
        }else if(size_hide=="1"){
            size_hide = "Yes"
        }


        const id = fetch._id
        num++;

        const data1 = {

            edit: `<a href="size_edit/${id}"><button type="button" class="btn btn-info icon-btn borderless"><span class="ion ion-md-create"></span></button></a>`,
            no: num,
            hide: `<button type="button" onclick="hide_size('${id}')" class="btn btn-outline-info icon-btn borderless">
                    <span class="ion ${hide_icon}"></span>
                    </button>`,
            name: fetch.size_name,
            size_hide:size_hide,

        };

        data_size.push(data1);

    }
    const results = {
        sEcho: 1,
        iTotalRecords: data_size.length,
        iTotalDisplayRecords: data_size.length,
        aaData: data_size,
    };

        res.render("size_add", {size_master: data_size})
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

const insertsize = async (req,res)=>{
    try {

        const {size_name} = req.body;

        const size_hide = 0;
        const date = new Date();

        const size = new Size({
            size_name:size_name,
            size_hide,
            date,
        })

        const insertsize = await size.save();
        res.redirect('/size_add');

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

const hidesize = async (req,res)=>{
    const sizeId = req.params.id;

    const size = await Size.findOne({ _id: sizeId });

    if (!size) {
        return res.status(404).send("Size not found");
    }

    size.size_hide = size.size_hide === "0" ? "1" : "0";
    await size.save();

    res.redirect('/size_add');

}

const getsizeeditInfo = async (req,res)=>{

    try {

         const sizeId = req.params.id;
         const size = await Size.findById(sizeId);

         if (!size) {
             return res.status(404).json({ error: 'Size not found' })
         }

         res.render("size_edit", { size });

     } catch (error) {
         console.error("Error executing query", error);
         res.status(500).send("Database query error");
     }

}

const updatesize = async (req,res)=>{
    try {
        const sizeId = req.params.id;
        const { size_name } = req.body;
        let updateFields = {};
        if (size_name) updateFields.size_name = size_name;

        const updatesize = await Size.findByIdAndUpdate(sizeId,updateFields, { new: true });

        res.redirect('/size_add');

            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
}

module.exports = {
    getsizeInfo,
    insertsize,
    hidesize,
    getsizeeditInfo,
    updatesize,
}