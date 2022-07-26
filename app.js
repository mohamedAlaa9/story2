//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema=new mongoose.Schema({
  Email:String,
  Password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["Password"]});
const User=mongoose.model("user",userSchema);
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/login",function(req,res){
  const userName=req.body.username;
  const password=req.body.password;
  User.findOne({Email:userName},function(err,foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.Password===password){
          res.render("secrets");
        }
      }
    }
  });
});
app.post("/register",function(req,res){
  const newUser=new User({
    Email:req.body.username,
    Password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});
app.listen(3000,function(){
  console.log("server is running appropriatly");
});
