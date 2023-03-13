const { Router } = require('express');
const express = require('express');
const checkUser = require('../middlewares/checkUser')
const router = express.Router();

const { getHomePage,
    getLoginPage, postLoginPage,
    getUserSignUpPage, postSignUpPage,
    getOtpPage, postOtpPage, resendOTP,
    ForgotPasswordemil, postForgotPassword,
    getAllProductPage,brandSelect,
    getProductDetail, addToCart, getCartPage,
    removeFromCart, incrementQuantity, decrementQuantity, getUserCheckout,postCouponCode,postUserCheckout, getAddAddress, postAddAddress, getUserPayment, getWishlistPage, addToWishList, removeFromWishlist, priceHighToLow, priceLowToHigh, categorySelect,
    postSearchProduct,
    getProfile,
    getOrderHistory,
    userLogout,
    getEditAddress,
    postEditAddress,
    getOrders
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
router.get('/profile',getProfile)
router.post('/applycoupon',postCouponCode)
router.post('/add-new-address',postAddAddress)
router.post('/search-product',postSearchProduct)

//wishlist
router.get('/wish-list',getWishlistPage)
router.get('/addtowishlist/:id',addToWishList)
router.get('/removeFromWishList/:id', removeFromWishlist)

router.get('/checkout', getUserCheckout)

router.post('/forgot', postForgotPassword)
router.post('/signup', postSignUpPage)
router.post('/otp', postOtpPage)  
router.post('/login', postLoginPage) 
router.post('/placeorder',postUserCheckout)
router.get('/verifyPayment',getUserPayment)



//sort
router.get('/lowtohigh',priceLowToHigh)
router.get('/hightolow',priceHighToLow)
router.get('/categoryproduct/:catgy',categorySelect)
router.get('/brandproduct/:brandsel',brandSelect)
router.get('/edit-address/:id',getEditAddress)
router.post('/edit-address',postEditAddress)

router.get('/order-history',getOrderHistory)
router.get('/logout',userLogout)

//order history
router.get('/orders/:id',getOrders)

module.exports = router    