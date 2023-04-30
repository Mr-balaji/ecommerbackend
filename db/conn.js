
const moongose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

moongose.connect(process.env.MONGODB_URL,
    {useNewUrlParser:true}
    ).then(()=>{
        console.log("connection successfull");
    }).catch((err)=>{
        console.log(err);
    })