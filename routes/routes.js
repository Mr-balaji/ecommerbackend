const express = require("express");
const router = new express.Router();
const usermodal = require("../models/User")
const jwt = require('jsonwebtoken');
const moment = require("moment");
const CircularJSON = require('circular-json');

const Product = require("../models/product")
const Order = require("../models/buynow");

const multer = require('multer');
const adminlogin = require("../models/Admin");
const product = require("../models/product");

const upload = multer({dest:'uploads'})


//create Api For User Resister
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


              }
          })
      }
   })

})


//create Api For User Login
router.post("/login",async(req,res)=>{


  const email = req.body.email;
  const password= req.body.password;

  const secretKey = "tokenkey"


   usermodal.findOne({email:email,password:password},async(err,user) => {
      if(user){

          const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

          await usermodal.updateOne({ _id: user._id }, { $set: { token } });
          res.send({"message":"User Login Successful",user,token});

      }else{
          res.send({"message":"User Not Found"})
      }
   })

})

//Api For Admin Login

router.post("/adminlogin",async(req,res)=>{


  const email = req.body.email;
  const password= req.body.password;

  const secretKey = "admintokenkey"

  adminlogin.findOne({email:email,password:password},async(err,user) => {
      if(user){

          const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

          await adminlogin.updateOne({ _id: user._id }, { $set: { token } });
          res.send({"message":"User Login Successful",user,token});

      }else{
          res.send({"message":"User Not Found"})
      }
   })

})




// Create an API endpoint to get the Order count
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

router.get('/')

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




  const  productName = req.body.productName;
  const productDescription = req.body.productDescription;
  const price= req.body.price;
  const productImage = req.file.path;

  const product = new Product({
    productName,
    productDescription,
    price,
    productImage
  });
   await product.save();
  //  console.log(product);
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

// update Records
router.put('/api/product/:id', (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  Product.findByIdAndUpdate(
    id,
    updateData,
    { new: true },
    (err, updatedDocument) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(updatedDocument);
      }
    }
  );
});





// delete Records
router.delete('/api/product/:id', (req, res) => {
  const id = req.params.id;

  Product.findByIdAndRemove(id, (err, removedDocument) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!removedDocument) {
      res.status(404).json({ error: 'Document not found' });
    } else {
      res.json({ message: 'Document deleted successfully' });
    }
  });
});




// Endpoint to handle product sorting
router.get('/productsbycategory', (req, res) => {
  // Extract category parameter from request query
  const category = req.query.category;

  // console.log(category);

  try {
    Product.find({ productName: category }, (err, products) => {
      if (err) throw err;

      res.send(products)
      console.log(products);
  })
  } catch (error) {
    res.status(500).send(error.message);
  }




  // Filter products based on category (if provided)
  // let filteredProducts = category
  //   ? Product.filter(product => product.category === category)
  //   : Product;

  // // Sort filtered products by name
  // // filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

  // // Send response with sorted products
  // res.json(filteredProducts);
});

router.post("/buynow",async(req,res)=>{
  const productName = req.body[0].productName
  const  productDescription = req.body[0].productDescription
  const productPrice = req.body[0].productPrice
  const quantity = req.body[0].quantity
  const now = new Date();
  // const currentMonth = now.getMonth() + 1;
  const monthName = now.toLocaleString('default', { month: 'long' });


  const order = new Order({
    productName,
    productDescription,
    productPrice,
    quantity,
    registerdate: now,
    registermonth: monthName,
  });
   await order.save();
  //  console.log(product);
     res.status(201).send('Product details Added successfully');


})

router.get('/ordercount', async (req, res) => {
  try {
    const order = await Order.aggregate([
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
      const count = order.find((item) => item._id === i + 1)?.count || 0;
      chartData.push({ month: monthName, count: count });
    }
    res.json(chartData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});











module.exports = router;
