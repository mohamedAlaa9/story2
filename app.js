//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const app = express();
const mongoose = require("mongoose");
//const bcrypt = require("bcrypt");
//const saltRounds = 10;
//const md5=require("md5");
//const encrypt=require("mongoose-encryption");


//userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["Password"]});

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret:"our little secret.",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("user", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.get("/secrets",function(req,res){
  if(req.isAuthenticated()){
    res.render("secrets");
  }else{
    res.redirect("/");
  }
});
app.get("/logout",function(req,res){
  req.logout(function(err){});
  res.redirect("/");
});
app.post("/login", function(req, res) {
  const userName = req.body.username;
  const password = req.body.password;
  // User.findOne({
  //   Email: userName
  // }, function(err, foundUser) {
  //   if (!err) {
  //     if (foundUser) {
  //       bcrypt.compare(password, foundUser.Password, function(err, result) {
  //         if(result===true){
  //           res.render("secrets");
  //       }else{
  //         console.log("Enter correct password");
  //         res.render("login");
  //       }
  //     });
  //     }
  //   }
  // });
  const user=new User({
    username:userName,
    password:password
  });
  req.login(user,function(err){
    if(err){
      console.log(err);
      res.redirect("/login");
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
      });
    }
  });
});
app.post("/register", function(req, res) {
  // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  //   const newUser = new User({
  //     Email: req.body.username,
  //     Password: hash
  //   });
  //   newUser.save(function(err) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.render("secrets");
  //     }
  //   });
  // });
  User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
      });
    }
  });
});
app.listen(3000, function() {
  console.log("server is running appropriatly");
});
