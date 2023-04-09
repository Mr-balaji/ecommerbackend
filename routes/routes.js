const express = require("express");
const router = new express.Router();
const usermodal = require("../models/User")
const jwt = require('jsonwebtoken');

const adminlogin = require("../models/Admin")


const User = require('../models/User');

// router.post("/resister",async(req,res)=>{
//    console.log("data",req.body.username);
// })

router.post("/resister",async(req,res)=>{
 
  const  name = req.body.name;
  const email = req.body.email; 
  const password= req.body.password;


  const now = new Date();
  const currentMonth = now.getMonth() + 1; 





  
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
                  registermonth: currentMonth,
              }
          )

          mainuser.save(err =>{
              if(err){
                res.send({message:"not resister successful"});
                //  console.log(mainuser);
              }else{
                  res.send({message:"resister successfuls"});
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
    const count = await usermodal.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;
