const express=require('express');
const router=express.Router();

const {getHomePage,
      getLoginPage,postLoginPage,
      getUserSignUpPage,postSignUpPage,
      getOtpPage,postOtpPage,resendOTP,
      ForgotPasswordemil,postForgotPassword,
      getAllProductPage}=require('../controllers/user')

router.get('/',getHomePage)
router.get('/login',getLoginPage)
router.get('/signup',getUserSignUpPage)
router.get('/otp',getOtpPage)
router.get('/resend',resendOTP)
router.get('/forgot',ForgotPasswordemil)
router.get('/productpage',getAllProductPage)


router.post('/forgot',postForgotPassword)
router.post('/signup',postSignUpPage)
router.post('/otp',postOtpPage)
router.post('/login',postLoginPage)
 

 

module.exports =router 