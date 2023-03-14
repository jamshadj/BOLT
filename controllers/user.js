const express = require("express");

const sentOTP = require("../helper/otp");
const productModel = require("../models/productModel");
const brandModel = require("../models/brandModel");
const bannerModel = require("../models/bannerModel");
const categoryModel = require("../models/categoryModel");
const UserModel = require("../models/UserModel");
const couponModel = require("../models/couponModel")
const orderModel = require("../models/orderModel")
const createId = require("../helper/createId")
var bcrypt = require("bcrypt");
const sharp = require('sharp')
const axios = require('axios')
const { create } = require("../models/productModel");
const session = require("express-session");
const ProductModel = require("../models/productModel");
var salt = bcrypt.genSaltSync(10);

let userDetails;
let password;
//HOME
const getHomePage = async (req, res) => {
  let product = await productModel.find({block: false}).limit(8).lean();
  let brand = await brandModel.find().limit(4).lean();
  let banner = await bannerModel.find().lean();
  console.log(banner);
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



const userLogout=(req,res)=>{
  req.session.destroy()
  res.redirect('/')
}
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
  try {
    const [category, brand] = await Promise.all([
      categoryModel.find({ block: false }).lean(),
      brandModel.find({ block: false }).lean()
    ]);
    let products = await productModel.find({ block: false }).lean();
    const user = req.session.user;
    const priceprod = req.session.priceprod;
    const catgproducts = req.session.catgproducts;
    const brandproducts = req.session.brandproducts;

    
    
    if (priceprod) {
      if (req.session.hlstatus) {
        res.render("users/allProductPage", {
          priceprod,
          hlstatus: req.session.hlstatus,
          category,
          brand,
          user,
          products:priceprod
        }); 
      }
    } else if (catgproducts) {
      if (req.session.catstatus) {
        res.render("users/allProductPage", {
          catgproducts,
          catstatus: req.session.catstatus,
          category,
          brand,
          user,
          products:catgproducts
        }); 
      }
    } else if (brandproducts) {
      
      if (req.session.brandstatus) {
        console.log("hello");
        res.render("users/allProductPage", {
          brandproducts,  
          brandstatus: req.session.brandstatus,
          category,
          brand,
          user,
          products:req.session.brandproducts
        }); 
      }
    } else {
      res.render("users/allProductPage", {
        category,
        products,
        brand,
        user
      });
    }
  } catch (err) {
    console.log('Error:', err);
    // Handle the error here
  }
};

const getProductDetail = async (req, res) => {
  try {
    let proid = req.params.id;
    let user = await req.session.user;
    let products = await productModel.find().limit(4).lean();
    let Quantity = await productModel.findOne({ _id: proid }).select('quantity').lean();
    let product = await productModel.findOne({ _id: proid }).lean();
    let noQuantity = (Quantity.quantity === 0) ? true : false;
    let lowQuantity = (Quantity.quantity > 0 && Quantity.quantity <= 5) ? true : false;
    res.render("users/productDetail", { product, products, user, noQuantity, lowQuantity });
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
    req.session.user.cartQuantity=cartQuantity
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
      item.itemprize = item.prize * item.quantity
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
      message,
      cartMessage,
      msg
    });
    cartMessage=null;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

let cartMessage=null;
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
const getUserCheckout = async (req, res) => {

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
    item.itemprize = item.prize * item.quantity
  })

  let coupon = req.session.coupon

  let cashback = {}
  let date = new Date()
  if (coupon) {

    if (totalAmount > coupon.minimum_purchase_amount) {
      console.log(coupon.discount);
      cashback.discountedPrice = totalAmount - coupon.discount
      cashback.discount = coupon.discount
      console.log("coupon added=" + cashback.discountedPrice);

    }

  }

  res.render('users/checkout', { products, totalAmount, address, cart, coupon, cashback, itemprize, users })
  cashback = null

}



const postUserCheckout = async (req, res) => {

  const userId = req.session.user._id;
  const user = await UserModel.findById(userId).lean();

  const cart = user.cart;

  const cartList = cart.map((item) => {
    return item.id;
  });

  const { address } = await UserModel.findOne({ _id: userId }, { address: 1 });
  const selectedAddress = address.find(e => (e.id == req.body.useraddress));

  const products = await productModel.find({ _id: { $in: cartList } }).lean();

  const orderItems = products.map((item, i) => {
    return {
      product: item._id,
      name: item.productname,
      image: item.image.filename,
      quantity: cart[i].quantity,
      price: item.prize,
    };
  });
  let totalItemsPrice = 0;
  orderItems.forEach((item) => {
    totalItemsPrice += item.quantity * item.price;
  });

  let discount = 0;
  let coupon = req.session.coupon;
  if (coupon) {
    if (totalItemsPrice > coupon.minimum_purchase_amount) {
      discount = coupon.discount;
      await couponModel.updateOne({ _id: coupon._id }, { $inc: { maximum_uses: -1 } });
    }

  }
  const shippingAddress =
  {
    name: `${selectedAddress.firstname} ${selectedAddress.lastname}`,
    address: `${selectedAddress.address}`,
    state: `${selectedAddress.state}`,
    pincode: `${selectedAddress.town} ${selectedAddress.pincode}`,
    phoneno: `${selectedAddress.phonenumber}`
  }
    ;


  const totalPrice = totalItemsPrice - discount;
  const { paymentMethod } = req.body

    const order = new orderModel({
      user: userId,
      orderItems: orderItems,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      itemsPrice: totalItemsPrice,
      discount: discount,
      totalPrice: totalPrice,
      date: new Date(),
      orderStatus: 'pending',
    });
  req.session.orders=order
    if (req.body.paymentMethod !== 'COD') {




      let orderId = "order_" + createId();
      const options = {
          method: "POST",
          url: "https://sandbox.cashfree.com/pg/orders",
          headers: {
              accept: "application/json",
              "x-api-version": "2022-09-01",  
              "x-client-id": '333565b632336d7cea8d6caa61565333',
              "x-client-secret": 'fa3273e76456388f4f4498485b16a5647a19b6f1',
              "content-type": "application/json",
          },
          data: {
              order_id: orderId,
              order_amount: req.body.totalAmount||req.body.discountedPrice,
              order_currency: "INR",
              customer_details: {
                  customer_id:userId,
                  customer_email: 'jamshadjamshu596@gmail.com',
                  customer_phone: '7012257903',
              },
              order_meta: {
                  return_url: "http://localhost:8000/verifyPayment?order_id={order_id}",
              },
          },
      };

      await axios
          .request(options)
          .then(function (response) {

              return res.render("users/paymentTemp", {
                  orderId,
                  sessionId: response.data.payment_session_id,
              });
          })
          .catch(function (error) {
              console.error(error);
          });
  }  else {
    await order.save();
    for (let i = 0; i < products.length; i++) {
      await productModel.updateOne({ _id: products[i]._id }, { $inc: { quantity: -orderItems[i].quantity } });
   
    await UserModel.findByIdAndUpdate(userId, { $set: { cart: [] } });

    res.render('users/order-confirmed');

  }
};
}
const postCouponCode = (req, res) => {
  console.log("post coupon");
  return new Promise((resolve, reject) => {
    console.log("code" + req.body.couponcode);
    couponModel.findOne({ code: req.body.couponcode }).then((coupon) => {
      req.session.coupon = coupon;
      res.redirect("/checkout");
    });
  });
  
}
  


const getUserPayment = async (req, res) => {
  const userId = req.session.user._id;
  const user = await UserModel.findById(userId).lean();

  const cart = user.cart;
  const cartList = cart.map((item) => {
    return item.id;
  });     
  const products = await productModel.find({ _id: { $in: cartList } }).lean();

  const order_id = req.query.order_id;

  const options = {
    method: "GET",
    url: "https://sandbox.cashfree.com/pg/orders/" + order_id,
    headers: { 
      accept: "application/json",
      "x-api-version": "2022-09-01",
      "x-client-id": "333565b632336d7cea8d6caa61565333",
      "x-client-secret": "fa3273e76456388f4f4498485b16a5647a19b6f1",
      "content-type": "application/json",
    },
  };

  try {
    const response = await axios.request(options);
    if (response.data.order_status === "PAID") {
      await orderModel.create(req.session.orders);
      for (let i = 0; i < products.length; i++) {
        await productModel.updateOne({ _id: products[i]._id }, { $inc: { quantity: -req.session.orders.orderItems[i].quantity } });
      }
      await UserModel.findByIdAndUpdate(userId, { $set: { cart: [] } });
      res.render("users/order-confirmed");
    } else {
      res.redirect("/cart");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/cart");
  }
};



// const getUserPayment=(req,res)=>{

// }







const getAddAddress = (req, res) => {
  res.render('users/add-New-Address')
}
const postAddAddress = async (req, res) => {
  const _id = req.session.user._id;
  console.log("post checkout");
  const { firstname, lastname, country, address, state, town, pincode, phonenumber, landmark } = req.body;

  // Get the user from the database using the _id
  const user = await UserModel.findById(_id);

  // Set the address fields of the user document
  user.address.push({
    firstname: firstname,
    lastname: lastname,
    country: country,
    address: address,
    state: state,
    town: town,
    pincode: pincode,
    phonenumber: phonenumber,
    landmark: landmark,
    id: createId()
  });

  // Save the updated user document
  await user.save();

  // Send the response to the client
  res.redirect('/checkout')
}


//edit address

 const getEditAddress=async (req,res)=>{
  const user=req.session.user;
  const Id=req.params.id
  let {address}=await UserModel.findOne({_id:user._id},{address:1}).lean()
 let data=address.find(e=>e.id==Id)
 if (user) {
  res.render('users/editAddress',{data})
 } else {
  res.redirect('/')
 }

  res.render('users/editAddress')
 }
 const postEditAddress = async (req, res) => {
  try {
      await UserModel.updateOne(
          { _id: req.session.user._id, "address.id": req.body.id },
          {
              $set: {
                  "address.$.firstname": req.body.firstname,
                  "address.$.lastname": req.body.lastname,
                  "address.$.country": req.body.country,
                  "address.$.address": req.body.address,
                  "address.$.landmark": req.body.landmark,
                  "address.$.state": req.body.state,
                  "address.$.town": req.body.town,
                  "address.$.pincode": req.body.pincode,
                  "address.$.phonenumber": req.body.phonenumber
              }
          }
      );   
      res.redirect("/profile");
  } catch (error) {
      console.error(error);
      res.render("404page");
  }
};


//wishlist

const getWishlistPage=async(req,res)=>{
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.redirect("/login");
    }
      
    // Get user and wish list details
    const user = req.session.user;
    const userId = user._id;

    const wishListDetails = await UserModel.findOne({ _id: userId }, { wishlist: 1 });
  

      // Get cart items 
      const wishLIstItems =wishListDetails.wishlist.map((item) => {
        return item.id;
      });

     
    // Get product details for cart items
    const products = await productModel.find({ _id: { $in: wishLIstItems } }).lean();
 


  res.render('users/wish-list',{products})
}catch (error) {
  console.error(error);
  res.status(500).json({
    message: 'Internal Server Error',
  });
}
}

const addToWishList=async(req,res)=>{
  try {
    if (req.session.user) {
      const user_id = req.session.user._id;
      const pdt_id = req.params.id;
      await UserModel.updateOne(
        { _id: user_id },
        { $addToSet: { wishlist: { id: pdt_id } } }
      );
      res.redirect("/wish-list");
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
}
const removeFromWishlist= async (req, res) => {
  const userId = req.session.user._id;
  const proid = req.params.id;
  await UserModel.updateOne(
    { _id: userId },
    { $pull: { wishlist: { id: proid } } }
  );
  res.redirect("/wish-list");
};


// sort

const priceHighToLow=async(req,res)=>{
  priceprod = await productModel
          .find()
          .sort({ prize: -1 })
          .lean();
          const hlstatus=true;
          console.log(priceprod);
          req.session.priceprod =priceprod ;
          req.session.hlstatus=hlstatus;
    res.redirect('/productpage')
}
const priceLowToHigh=async(req,res)=>{
  priceprod = await productModel
          .find()
          .sort({ prize: 1 })
          .lean();req.session.priceprod =priceprod ;
          const lhstatus=true;
          req.session.lhstatus=lhstatus
          res.redirect('/productpage')
}

//filter

const categorySelect=async(req,res)=>{
  console.log("hello");
  const catgy = req.params.catgy;

    const catgproducts = await productModel.find({ category: catgy }).lean();

    let catstatus = true;
       
    console.log(catgproducts);   
    req.session.catstatus = catstatus;
    req.session.catgproducts = catgproducts;

    res.redirect("/productpage");
}

const brandSelect=async(req,res)=>{
  const brandsel = req.params.brandsel;
console.log(brandsel);
  const brandproducts = await productModel.find({ brand: brandsel }).lean();

  let brandstatus = true;
  console.log(brandproducts);   
  req.session.brandstatus = brandstatus;
  req.session.brandsproducts = brandproducts;

  res.redirect("/productpage");
}   

   
const postSearchProduct = async (req, res) => {
  try {
    const [category, brand] = await Promise.all([
      categoryModel.find({ block: false }).lean(),
      brandModel.find({ block: false }).lean()
    ]);

    if (req.body.name) {
      const products = await productModel.find({
        $and: [
          { status: 'available' },
          {
            $or: [
              { productname: new RegExp(req.body.name, 'i') },
              { category: new RegExp(req.body.name, 'i') }
            ]
          }
        ]
      }).lean();
      res.render('users/allProductPage', { products: products, category: category, brand: brand });
    } else {
      res.render('users/allProductPage', { category: category, brand: brand });
    }

  } catch (err) {
    console.log('Error:', err);
    // Handle the error here
  }
};


//profile  

const getProfile = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await UserModel.findById(userId).lean()
    const address = user.address;
    res.render('users/profile', { user, address });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
  
};     

//order history
const getOrderHistory = async (req, res) => {
  const user = req.session.user;
  const orders = await orderModel.find({ user: user._id }).lean();
  res.render('users/ordersHistory', { user, orders });
}
       
   
const getOrders=async (req,res)=>{
  const proId=req.params.id
  console.log(proId);
  const orderDetails=await orderModel.find({"orderItems._id":proId}).lean()
  console.log(orderDetails);
  res.render('users/order-History-View', { orderDetails });

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
  postUserCheckout,
  getAddAddress,
  postAddAddress,

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
  postCouponCode,
  getUserPayment,
  addToWishList,


  // wishlist
  getWishlistPage,
  removeFromWishlist,
  getEditAddress,
  postEditAddress,

  //sort
  priceHighToLow,
  priceLowToHigh,

  //filter
  categorySelect,brandSelect,postSearchProduct,

  //profile

  getProfile,getOrderHistory,userLogout,
  getOrders 
}