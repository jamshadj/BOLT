const express = require("express");

const sentOTP = require("../helper/otp");
const productModel = require("../models/productModel");
const brandModel = require("../models/brandModel");
const bannerModel = require("../models/bannerModel");
const categoryModel = require("../models/categoryModel");
const UserModel = require("../models/UserModel");
const couponModel=require("../models/couponModel")
var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

let userDetails;
let password;
//HOME
const getHomePage = async (req, res) => {
  let product = await productModel.find().limit(8).lean();
  let brand = await brandModel.find().limit(4).lean();
  let banner = await bannerModel.find().lean();
  let user = await req.session.user;
  res.render("users/Home", {
    CSS: ["stylesheet/home.css"],
    product,
    brand,
    banner,
    user,
  });
};

const getLoginPage = (req, res) => {
  res.render("users/login", { CSS: ["stylesheet/adminlogin.css"], message });
};

//SIGNUP
const getUserSignUpPage = (req, res) => {
  res.render("users/userSignup", {
    CSS: ["stylesheet/adminlogin.css"],
    message,
  });
};

const postSignUpPage = async (req, res) => {
  const exstinguser = await UserModel.findOne({ email: req.body.email });
  if (exstinguser) {
    message = "Email already exist";
    res.redirect("/signup");
  } else if (req.body.phoneno.length != 10) {
    message = "Mobile number is not vailed";
    res.redirect("/signup");
  } else if (req.body.password.length < 8) {
    message = "Please enter password leangth more than 8 charachter";
    res.redirect("/signup");
  } else if (req.body.password != req.body.confirmpassword) {
    message = "Password is not same";
    res.redirect("/signup");
  } else {
    console.log("otp send entered");

    userDetails = req.body;
    password = req.body.password;
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
  res.render("users/verifyOTP", {
    CSS: ["stylesheet/adminlogin.css"],
    message,
  });
};

const postOtpPage = (req, res) => {
  if (signupOTP == req.body.verify) {
    let block = false;
    // const { name, email, mobile, password } = req.body
    let users = new UserModel({
      ...userDetails,
      password: bcrypt.hashSync(password, salt),
      block,
    });
    users.save((err, data) => {
      if (err) {
        console.log(err);
        res.render("userSignup", {
          error: true,
          message: "Something went wrong",
        });
      } else {
        req.session.user = userDetails;
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/otp");
    message = "OTP is incorrect";
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

const ForgotPasswordemil = (req, res) => {
  res.render("users/forgot-email", {
    CSS: ["stylesheet/adminlogin.css"],
    message,
  });
};

let signupEmail;
var message;

const postLoginPage = async (req, res) => {
  const { email, password } = req.body;
  const exstinguser = await UserModel.findOne({ email: email });

  if (exstinguser) {
    if (exstinguser.block == true) {
      message = "Sorry you are banned";
      res.redirect("/login");
    } else if (bcrypt.compareSync(password, exstinguser.password)) {
      req.session.user = exstinguser;
      // req.sessio.user=exstinguser.email
     
      res.redirect("/");
    } else {
      message = "Incorrect password";
      res.redirect("/login");
    }
  } else {
    message = "Email is not exist";
    res.redirect("/login");
  }
};

const postForgotPassword = async (req, res) => {
  const exstinguser = await UserModel.findOne({ email: req.body.email });
  if (exstinguser) {
    console.log("otp send entered");
    userDetails = req.body;
    let otp = Math.floor(Math.random() * 1000000);
    signupOTP = otp;
    signupEmail = req.body.email;
    sentOTP(req.body.email, otp);
    console.log("otp sent");
    res.redirect("/otp");
  } else {
    message = "Email not exist";
    res.redirect("/forgot");
  }
};

//PRODUCT PAGE

const getAllProductPage = async (req, res) => {
  let category = await categoryModel.find().lean();
  let product = await productModel.find().lean();
  let brand=await brandModel.find().lean();
  res.render("users/allProductPage", { category, product ,brand});
};
const getProductDetail = async (req, res) => {
  try { 
    let proid = req.params.id;
    let products = await productModel.find().limit(4).lean();
    let product = await productModel.findOne({ _id: proid }).lean();
    res.render("users/productDetail", { product, products });
  } catch (error) { 
    console.error(error);
    res.status(500).send("Internal Server Error");
  }  
};
//cart

const addToCart = async (req, res) => {
  try {
    if (req.session.user) {
      const user_id = req.session.user._id;
      const pdt_id = req.params.id;
      await UserModel.updateOne(
        { _id: user_id },
        { $addToSet: { cart: { id: pdt_id, quantity: 1 } } }
      );
      res.redirect("/cartpage");
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
};
let msg;
const getCartPage = async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.redirect("/login");
    }

    // Get user and cart details
    const user = req.session.user;
    const cartQuantity = {};
    const userId = user._id;
    const cartDetails = await UserModel.findOne({ _id: userId }, { cart: 1 });

    // Get cart items and quantity
    const cartItems = cartDetails.cart.map((item) => {
      cartQuantity[item.id] = item.quantity;
      return item.id;
    });

    // Get product details for cart items
    const products = await productModel.find({ _id: { $in: cartItems } }).lean();
 
    // Calculate total amount and discount
    let totalAmount = 0;
    let totalMRP = 0;
    let itemprize;
    products.forEach((item, index) => {
      const quantity = cartQuantity[item._id];
      products[index].quantity = quantity;
      totalAmount = totalAmount + item.prize * cartQuantity[item._id];
      totalMRP = totalMRP + item.MRP * cartQuantity[item._id];
      item.itemprize=item.prize*item.quantity
    });
    const discount = totalMRP - totalAmount;

    res.render("users/cart", {
      products,
      totalAmount,
      cartDetails,
      totalMRP,
      user,
      discount,
      itemprize,

      msg
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

 
// Increment product quantity
const incrementQuantity = async (req, res) => {
  try {
    // Update the cart item quantity for the logged in user
    await UserModel.updateOne(
      {
        _id: req.session.user._id,
        cart: { $elemMatch: { id: req.params.id } },
      },
      {
        $inc: {
          "cart.$.quantity": 1, // Increment the cart item quantity by 1
        },
      }
    );
    // Redirect to the cart page
    res.redirect('/cartpage');
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
};

// Decrement product quantity
const decrementQuantity = async (req, res) => {
  try {
    // Find the cart item with the given ID for the logged in user
    const { cart } = await UserModel.findOne(
      { "cart.id": req.params.id },
      { _id: 0, cart: { $elemMatch: { id: req.params.id } } }
    );

    if (cart[0].quantity <= 1) {
      // If the cart item quantity is 1, remove the item from the cart
      await UserModel.updateOne(
        {
          _id: req.session.user._id,
        },
        {
          $pull: {
            cart: { id: req.params.id }, // Remove the cart item with the given ID
          },
        }
      );
    } else {
      // Decrement the cart item quantity by 1
      await UserModel.updateOne(
        {
          _id: req.session.user._id,
          cart: { $elemMatch: { id: req.params.id } },
        },
        {
          $inc: {
            "cart.$.quantity": -1, // Decrement the cart item quantity by 1
          },
        }
      );
    }
    // Redirect to the cart page
    res.redirect('/cartpage');
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
};

 
const removeFromCart = async (req, res) => {
  const userId = req.session.user._id;
  const proid = req.params.id; 
  await UserModel.updateOne(
    { _id: userId },
    { $pull: { cart: { id: proid } } }
  );
  res.redirect("/cartpage");
};
const getUserCheckout=async (req, res) => {

  const _id = req.session.user._id

  const users = await UserModel.findById({ _id }).lean()
  const address = users.address
  const cart = users.cart
  const cartQuantity = {}
  const cartItems = cart.map((item) => {
      cartQuantity[item.id] = item.quantity
      return item.id;
  })


  const product = await productModel.find({ _id: { $in: cartItems } }).lean()
  const products = product.map(item => {
      return { ...item, quantity: cartQuantity[item._id] }
  })
  
  let totalAmount = 0;
  let coupons = await couponModel.find().lean()
  let itemprize;
  products.forEach((item, index) => {
    const quantity = cartQuantity[item._id];
    products[index].quantity = quantity;
    totalAmount = totalAmount + item.prize * cartQuantity[item._id];
    item.itemprize=item.prize*item.quantity
  })
 
  let coupon = req.session.coupon

  let cashback = {}
  if (coupon) {
      if (totalAmount > coupon.minimum_purchase_amount) { 
          cashback.discountedPrice = totalAmount-coupon.discount
          cashback.discount = coupon.discount
          console.log("coupon added"+cashback.discountedPrice+coupon.discount);
      }
  }

  res.render('users/checkout', { products, totalAmount, address, cart, coupons, cashback,itemprize})
  cashback = null
  req.session.coupon = null
}

const postCouponCode = (req,res) => {
  console.log("post coupon");
    return new Promise((resolve, reject) => {
      console.log("code"+req.body.couponcode);
        couponModel.findOne({ code: req.body.couponcode }).then((coupon) => {
            req.session.coupon = coupon;
            res.redirect("/checkout");
        });
    });
 
}

module.exports = {
  // Home page
  getHomePage,
  
  // Products
  getAllProductPage,
  getProductDetail,
  
  // Cart
  addToCart,
  getCartPage,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  
  // Checkout
  getUserCheckout,
  
  // Authentication
  getLoginPage,
  postLoginPage,
  getUserSignUpPage,
  postSignUpPage,
  getOtpPage,
  postOtpPage,
  resendOTP,
  ForgotPasswordemil,
  postForgotPassword,
  postCouponCode
};

