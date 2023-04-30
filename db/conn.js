
const moongose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

moongose.connect("mongodb+srv://balajidevtar:Balaji5558@cluster0.v6tqp0a.mongodb.net/ecommercewebsite2?retryWrites=true&w=majority;",
    {useNewUrlParser:true}
    ).then(()=>{
        console.log("connection successfull");
    }).catch((err)=>{
        console.log(err);
    })