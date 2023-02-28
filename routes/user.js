const { Router } = require('express');
const express = require('express');
const checkUser = require('../middlewares/checkUser')
const router = express.Router();

const { getHomePage,
    getLoginPage, postLoginPage,
    getUserSignUpPage, postSignUpPage,
    getOtpPage, postOtpPage, resendOTP,
    ForgotPasswordemil, postForgotPassword,
    getAllProductPage,
    getProductDetail, addToCart, getCartPage,
    removeFromCart, incrementQuantity, decrementQuantity, getUserCheckout,postCouponCode,postUserCheckout,getOrderConfirmed, getAddAddress, postAddAddress
} = require('../controllers/user')

router.get('/', getHomePage)
router.get('/login', getLoginPage)
router.get('/signup', getUserSignUpPage)
router.get('/otp', getOtpPage)
router.get('/resend', resendOTP)
router.get('/forgot', ForgotPasswordemil)
router.get('/add-new-address',getAddAddress)

// router.use(checkUser)
router.use(checkUser)
router.get('/productpage', getAllProductPage)
router.get('/product/:id', getProductDetail)
router.get('/addtocart/:id', addToCart)
router.get('/cartpage', getCartPage)
router.get('/removeFromCart/:id/:quantity', removeFromCart)
router.get('/incrementQuantity/:id', incrementQuantity)
router.get('/decrementQuantity/:id', decrementQuantity)
router.post('/applycoupon',postCouponCode)
router.post('/add-new-address',postAddAddress)

router.get('/checkout', getUserCheckout)

router.post('/forgot', postForgotPassword)
router.post('/signup', postSignUpPage)
router.post('/otp', postOtpPage)
router.post('/login', postLoginPage) 
router.post('/checkout',postUserCheckout)
router.get('/order-confirmed',getOrderConfirmed)
module.exports = router 