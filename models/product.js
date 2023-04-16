const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productDescription:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    
    productImage: {
      originalname: String,
      mimetype: String,
      buffer: Buffer,
    },
  
  
    
},
 {
        writeConcern: {
           w: 'majority',
           j: true,
           wtimeout: 1000
        }
})

module.exports = mongoose.model("products",productSchema);
