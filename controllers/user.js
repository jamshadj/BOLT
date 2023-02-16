const express = require("express");

const sentOTP = require("../helper/otp");
const adminModel = require("../models/adminModel");
const productModel=require("../models/productModel")
const brandModel=require("../models/brandModel")
const bannerModel=require("../models/bannerModel")
const categoryModel=require("../models/categoryModel")
const UserModel = require("../models/UserModel");
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

let userDetails;
let password;

//HOME

const getHomePage =async (req, res) => {
let product=await productModel.find().limit(6).lean()
let brand=await brandModel.find().limit(3).lean()
let banner=await bannerModel.find().lean()
  res.render("users/Home", { CSS: ["stylesheet/home.css"] ,product,brand,banner});
};

const getLoginPage = (req, res) => {
  res.render("users/login", { CSS: ["stylesheet/adminlogin.css"],message});
};

//SIGNUP
const getUserSignUpPage = (req, res) => {
  res.render("users/userSignup", { CSS: ["stylesheet/adminlogin.css"],message});
};

const postSignUpPage = async(req, res) => {
  const exstinguser=await UserModel.findOne({email:req.body.email})
  if(exstinguser){
    message ="Email already exist"
   res.redirect('/signup')
  }
  else if (req.body.phoneno.length != 10) {
    message ="Mobile number is not vailed"
    res.redirect('/signup')
  } else if (req.body.password.length < 8) {
    message ="Please enter password leangth more than 8 charachter"
    res.redirect('/signup')
  } else if (req.body.password != req.body.confirmpassword) {
    message ="Password is not same"
    res.redirect('/signup')
  } else {
    console.log("otp send entered");
    
    userDetails = req.body;
    password=req.body.password
    let otp = Math.floor(Math.random() * 1000000);
    signupOTP = otp;
    signupEmail = req.body.email;
    sentOTP(req.body.email, otp);
    console.log("otp sent");
    res.redirect("/otp");
  }
};

//OTP

const getOtpPage = (req, res) => {
  res.render("users/verifyOTP", { CSS: ["stylesheet/adminlogin.css"],message });
};

const postOtpPage = (req, res) => {
  if (signupOTP == req.body.verify) {
    let block = false;
    // const { name, email, mobile, password } = req.body
    let users = new UserModel({ ...userDetails, password:bcrypt.hashSync(password, salt), block });
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
    res.redirect("/otp")
    message="OTP is incorrect"
  }
};

const resendOTP = (req, res) => {
  res.redirect("/otp");
  let otp = Math.floor(Math.random() * 1000000);
  sentOTP(signupEmail, otp);
  console.log("reseb" + otp);
  signupOTP = otp;
  // ##############
  var countDownTime = 1200000;
  setTimeout(() => {
    otp = undefined;
    console.log("recountown");
  }, countDownTime);
  // ############## 
};

const ForgotPasswordemil=(req,res)=>{
  res.render("users/forgot-email", { CSS: ["stylesheet/adminlogin.css"],message});
}

let signupEmail;
var message;




 


const postLoginPage=async(req,res)=>{
  const { email, password } = req.body;
  const exstinguser=await UserModel.findOne({email: email})
 
  if (exstinguser) {
    if (exstinguser.block==true) {
      message ="Sorry you are banned"
      res.redirect("/login", { CSS: ["stylesheet/adminlogin.css"] },);
    }
    else if (bcrypt.compareSync(password, exstinguser.password) ) {
      res.redirect('/')
    }else{
      message ="Incorrect password"
    res.redirect('/login')
    }
  } else {
    message ="Email is not exist"
    res.redirect('/login')
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
  message="Email not exist"
  res.redirect('/forgot')
  }
};

//PRODUCT PAGE

const getAllProductPage=async(req,res)=>{
  let category=await categoryModel.find().lean()
  console.log(category);
  res.render("users/allProductPage",{category})
}


module.exports = {
      getHomePage,
      getLoginPage,postLoginPage,
      getUserSignUpPage,postSignUpPage,
      getOtpPage,postOtpPage,resendOTP,
      ForgotPasswordemil,postForgotPassword,
      getAllProductPage
      
};
