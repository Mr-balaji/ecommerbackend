
const moongose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

moongose.connect(process.env.MONGODB_URL,
    {useNewUrlParser:true,useUnifiedTopology: true ,family:4}
    ).then(()=>{
        console.log("connection successfull");
        console.log(typeof(process.env.MONGODB_URL));
    }).catch((err)=>{
        console.log(err);
    })