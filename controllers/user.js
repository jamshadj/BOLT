const express = require("express");

const sentOTP = require("../helper/otp");
const adminModel = require("../models/adminModel");
// MONGODB USER MODEL
const UserModel = require("../models/UserModel");
let userDetails;

const Home = (req, res) => {
  res.render("users/Home", { CSS: ["stylesheet/home.css"] });
};

const Login = (req, res) => {
  res.render("users/login", { CSS: ["stylesheet/adminlogin.css"] });
};

const SignUp = (req, res) => {
  res.render("users/userSignup", { CSS: ["stylesheet/adminlogin.css"] });
};

const getOTP = (req, res) => {
  res.render("users/verifyOTP", { CSS: ["stylesheet/adminlogin.css"] });
};

const ForgotPasswordemil=(req,res)=>{
  res.render("users/forgot-email", { CSS: ["stylesheet/adminlogin.css"] });
}



let signupEmail;
const postSignUp = async(req, res) => {
  const exstinguser=await UserModel.findOne({email:req.body.email})
  if(exstinguser){
    return false; 
  }
  else if (req.body.phoneno.length != 10) {
    return false;
  } else if (req.body.password.length < 8) {
    return false;
  } else if (req.body.password != req.body.confirmpassword) {
    return false;
  } else {
    console.log("otp send entered");
    userDetails = req.body;
    let otp = Math.floor(Math.random() * 1000000);
    signupOTP = otp;
    signupEmail = req.body.email;
    sentOTP(req.body.email, otp);
    console.log("otp sent");
    res.redirect("/otp");
  }
};


const postOTP = (req, res) => {
  if (signupOTP == req.body.verify) {
    let block = false;
    // const { name, email, mobile, password } = req.body
    let users = new UserModel({ ...userDetails, block });
    users.save((err, data) => {
      if (err) {
        console.log(err);
        res.render("userSignup", {
          error: true,
          message: "Something went wrong",
        });
      } else {
        res.redirect('/')
    
      }
    });
  } else {
    invalidOTP = true;
    return false;
  }
};

const resendOTP = (req, res) => {
  res.redirect("/otp");
  let otp = Math.floor(Math.random() * 1000000);
  sentOTP(signupEmail, otp);
  console.log("reseb" + otp);
  signupOTP = otp;
  // ##############
  var countDownTime = 60000;
  setTimeout(() => {
    otp = undefined;
    console.log("recountown");
  }, countDownTime);
  // ##############
};

const postLogin=async(req,res)=>{
  const { email, password } = req.body;
  const exstinguser=await UserModel.findOne({email: email})
 
  if (exstinguser) {
    if (exstinguser.block==true) {
      res.render("users/login", { CSS: ["stylesheet/adminlogin.css"] },);
    }
    else if (password==exstinguser.password ) {
      res.redirect('/')
    }else{
      res.render("users/login", { CSS: ["stylesheet/adminlogin.css"] },);
    }
  } else {
    return false
  }
}
 
const postForgotPassword=async(req, res) => {
  const exstinguser=await UserModel.findOne({email:req.body.email})
  if(exstinguser){
    console.log("otp send entered");
    userDetails = req.body;
    let otp = Math.floor(Math.random() * 1000000);
    signupOTP = otp;
    signupEmail = req.body.email;
    sentOTP(req.body.email, otp);
    console.log("otp sent");
    res.redirect("/otp");
  }else {
   return false
  }
};

module.exports = {
  Home,
  Login,
  SignUp,
  postSignUp,
  postOTP,
  getOTP,
  resendOTP,
  postLogin,
  ForgotPasswordemil,
  postForgotPassword
};
