const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/admin",{

}).then(() =>{
    console.log("Connect Successfully");
}).catch((e) =>{
    console.log(e);
})