const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    registerdate: { type: Date, default: Date.now },
    registermonth: { type: String, required: true },
    
    token: String,
  


},

 {
    writeConcern: {
       w: 'majority',
       j: true,
       wtimeout: 1000
    }
});

module.exports = mongoose.model("UserDetail",userSchema);