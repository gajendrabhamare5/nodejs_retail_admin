const Subscribe = require("../models/subscribe.js");
const insertsubscribers = async (req, res) => {

    const{ subscribe_email} = req.body
    const date = new Date().toISOString().slice(0, 10);

    let subscription = await Subscribe.findOne({email: subscribe_email} );
    if(subscription){
        const id = subscription._id;

        if(subscription.flag === 0){
            res.send("exist")
        }else if(subscription.flag === 1){
            const result = await Subscribe.findByIdAndUpdate(
                id,
                { flag: 0, date: date },
                { new: true }
            );
            if(result){
                res.send("ok1")
            }

        }

    }else{
        const result = new Subscribe({
            email: subscribe_email,
            date: date,
        })

        const insert = await result.save();

        if(insert){
            res.send("ok");
        }
    }
}

module.exports = {
    insertsubscribers,
}