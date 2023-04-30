const express = require("express");
const router = new express.Router();
const usermodal = require("../models/User")
const jwt = require('jsonwebtoken');
const moment = require("moment");

const Product = require("../models/product")

const multer = require('multer');
const adminlogin = require("../models/Admin")

const upload = multer({dest:'uploads'})

// router.post("/resister",async(req,res)=>{
//    console.log("data",req.body.username);
// }) 

router.post("/resister",async(req,res)=>{
 
  const  name = req.body.name;
  const email = req.body.email; 
  const password= req.body.password;



  const now = new Date();
  // const currentMonth = now.getMonth() + 1; 
  const monthName = now.toLocaleString('default', { month: 'long' });
  
   usermodal.findOne({email:email},(err,user) => {
      if(user){
          res.send({message:"user already resister"});
          console.log("user already resister");
      }else{
          const mainuser = new usermodal(
              {
                  name,
                  email,
                  password,
                  registerdate: now,
                  registermonth: monthName,
              }
          )

          mainuser.save(
            err =>{
              if(err){
                res.send({message:"not resister successful"});
                //  console.log(mainuser);
              }else{
                  res.send({message:"resister successfuls"});
      console.log(monthName);

                  // console.log(now);
                  // console.log(currentMonth);
              }
          })
      }
   })
  
})

router.post("/login",async(req,res)=>{
 
 
  const email = req.body.email; 
  const password= req.body.password;

  const secretKey = "tokenkey"

  
   usermodal.findOne({email:email,password:password},async(err,user) => {
      if(user){
          
          console.log(user);

          const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

          await usermodal.updateOne({ _id: user._id }, { $set: { token } });
          res.send({"message":"User Login Successful",user,token});
    
      }else{
          res.send({"message":"User Not Found"})
      }
   })
  
})

router.post("/adminlogin",async(req,res)=>{
 
 
  const email = req.body.email; 
  const password= req.body.password;

  const secretKey = "admintokenkey"

//    console.log(email);
  
  adminlogin.findOne({email:email,password:password},async(err,user) => {
      if(user){
          
          console.log(user);

          const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

          await adminlogin.updateOne({ _id: user._id }, { $set: { token } });
          res.send({"message":"User Login Successful",user,token});
    
      }else{
          res.send({"message":"User Not Found"})
      }
   })
  
})

// Create an API endpoint to get the user count
router.get('/api/users/count', async (req, res) => {
  try {
    const users = await usermodal.aggregate([
      {
        $group: {
          _id: {
            $month: "$registerdate"
          },
          count: {
            $sum: 1
          }
        }
      }
    ]);

    const chartData = [];
    for (let i = 0; i < 12; i++) {
      const month = moment().month(i);
      const monthName = month.format("MMMM");
      const count = users.find((item) => item._id === i + 1)?.count || 0;
      chartData.push({ month: monthName, count: count });
    }
    res.json(chartData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create Multer file uploads
// const upload = multer({
//   limits:{
//     fileSize:1000000,
//   },
//   fileFilter(req,file,cb){
//    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
//    return cb(new Error("please upload a valid image file"))
//   }


//   cb(undefined,true);
// }
// })

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });



 
  




router.post("/addproducts",upload.single('productImg'),async(req,res)=>{

  const { originalname, buffer, mimetype } = req.file;

  console.log("file",req.file);

 

  const  productName = req.body.productName;
  const productDescription = req.body.productDescription; 
  const price= req.body.price;
  

  console.log(productName);
  const product = new Product({
    productName,
    productDescription,
    price,
    productImage: {
      originalname,
      mimetype,
      buffer,
    },
  });

   await product.save();

   console.log(product);
     res.status(201).send('Product details Added successfully');




});
 


  
  



// Route for retrieving a product
// router.get('/products', async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).send('Product not found');
//     }

//     res.set('Content-Type', product.productImage.contentType);
//     res.send({
//       productName: product.productName,
//       productDescription: product.productDescription,
//       productPrice: product.productPrice,
//       productImage: product.productImage.image.toString('base64'),
//     });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports = router;





module.exports = router;
