const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
   
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    token: String,
 

},
 {
    writeConcern: {
       w: 'majority',
       j: true,
       wtimeout: 1000
    }
});

module.exports = mongoose.model("admins",adminSchema);