//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
//const md5=require("md5");
//const encrypt=require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  Email: String,
  Password: String
});

//userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["Password"]});
const User = mongoose.model("user", userSchema);
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.post("/login", function(req, res) {
  const userName = req.body.username;
  const password = req.body.password;
  User.findOne({
    Email: userName
  }, function(err, foundUser) {
    if (!err) {
      if (foundUser) {
        bcrypt.compare(password, foundUser.Password, function(err, result) {
          if(result===true){
            res.render("secrets");
        }else{
          console.log("Enter correct password");
          res.render("login");
        }
      });
      }
    }
  });
});
app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      Email: req.body.username,
      Password: hash
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

});
app.listen(3000, function() {
  console.log("server is running appropriatly");
});
