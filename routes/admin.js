const express=require('express');
const router=express.Router();

const {AdminLoginPage,
       AdminhomePage,
       AdminLogin,
       getProductsPage,
       getAddProducts,
       PostAddProducts,
       getproductedit,
       postProductEdit,
       blockproduct,
       unblockproduct,
       getcategory,
       postAddCategory,
       blockcategory,
       unblockcategory,
       getCategoryEdit,
       postCategoryEdit,
       getbrand,
       postbrand,
       blockBrand,
       unblockBrand,
       getBrandEdit,
       postBrandEdit,
       blockUser,
       unblockUser,
       getbanner,
       getcoupon,
       users,
       orders,
       addbanner,
       PostAddbanner,
       deleteBanner,
       getaddCoupon,
       postAddCoupon,
       getCouponEdit,
       postCouponEdit,
       deleteCoupon
      
      
    
   
       
      }=require('../controllers/admin');
const upload = require('../middlewares/multer');


//ROUTER SETTING
router.get('/',AdminLoginPage)
router.get('/home',AdminhomePage)

router.get('/products',getProductsPage)
router.get('/addproducts',getAddProducts)
router.get('/productedit/:id',getproductedit)
router.get('/blockproduct/:id',blockproduct)
router.get('/unblockproduct/:id',unblockproduct)

router.get('/addcategory',getcategory)
router.get('/blockcategory/:id',blockcategory)
router.get('/unblockcategory/:id',unblockcategory)
router.get('/categoryedit/:id',getCategoryEdit)

router.get('/addbrand',getbrand)
router.get('/blockbrand/:id',blockBrand)
router.get('/unblockbrand/:id',unblockBrand)
router.get('/brandedit/:id',getBrandEdit)

router.get('/users',users)
router.get('/blockuser/:id',blockUser)
router.get('/unblockuser/:id',unblockUser)

router.get('/banner',getbanner)
router.get('/addbanner',addbanner)
router.get('/deletebanner/:id',deleteBanner)


router.get('/coupon',getcoupon)
router.get('/addcupon',getaddCoupon)
router.get('/couponedit/:id',getCouponEdit)
router.get('/deletecoupon/:id',deleteCoupon)
router.get('/orders',orders)









router.post('/adminlogin',AdminLogin)
router.post('/addproducts',upload.fields([{ name: 'image', maxCount: 1 },{ name: 'subimage', maxCount: 3 }]),PostAddProducts)
router.post('/productedit',upload.fields([{ name: 'image', maxCount: 1 },{ name: 'subimage', maxCount: 3 }]), postProductEdit)
router.post('/addcategory',postAddCategory)
router.post('/categoryedit',postCategoryEdit)
router.post('/addbrand',postbrand)
router.post('/brandedit',postBrandEdit)
router.post('/addbanner',upload.single('image'),PostAddbanner)
router.post('/addcoupon',postAddCoupon)
router.post('/couponedit',postCouponEdit)

 
 
module.exports = router;