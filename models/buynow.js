const mongoose = require("mongoose")

const buyNowSchema = mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productDescription:{
        type:String,
        // required:true
    },
    price:{
        type:String,
        // required:true
    },

    quantity:{
       type:String
    }
},
 {
        writeConcern: {
           w: 'majority',
           j: true,
           wtimeout: 1000
        }
})

module.exports = mongoose.model("order",buyNowSchema);
