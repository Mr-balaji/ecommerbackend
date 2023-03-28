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
    token: String,
    // isadmin:{
    //     type:Boolean,
    //     require:true
    // },

},
 {
    writeConcern: {
       w: 'majority',
       j: true,
       wtimeout: 1000
    }
});

module.exports = mongoose.model("UserDetail",userSchema);