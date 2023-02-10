const express=require('express');
const router=express.Router();

const {Home,Login,SignUp,getOTP,postSignUp,postOTP,resendOTP,postLogin,ForgotPasswordemil,postForgotPassword}=require('../controllers/user')

router.get('/',Home)
router.get('/login',Login)
router.get('/signup',SignUp)
router.get('/otp',getOTP)
router.get('/resend',resendOTP)
router.get('/forgot',ForgotPasswordemil)
router.post('/forgot',postForgotPassword)
router.post('/signup',postSignUp)
router.post('/otp',postOTP)
router.post('/login',postLogin)
 

 

module.exports =router 