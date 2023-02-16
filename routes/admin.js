const express = require('express');
const router = express.Router();


const {
      getAdminLoginPage, postAdminLogin,
      getAdminHomePage,

      //product
      getProductsPage,
      getAddProducts, postAddProducts,
      getProductEdit, postProductEdit,
      blockProduct, unblockProduct,

      //category
      getCategory, postAddCategory,
      blockCategory, unblockCategory,
      getCategoryEdit, postCategoryEdit,

      //brand
      getBrand,
      getAddBrand, postAddBrand,
      blockBrand, unblockBrand,
      getBrandEdit, postBrandEdit,

      //user
      getUsers,
      blockUser, unblockUser,

      //banner
      getBanner,
      getAddBanner, PostAddBanner,
      deleteBanner,

      //coupon
      getCoupon,
      getAddCoupon, postAddCoupon,
      getCouponEdit, postCouponEdit,
      deleteCoupon,



      orders,



} = require('../controllers/admin');
const verifyAdmin = require('../middlewares/adminSession');
const upload = require('../middlewares/multer');


//ROUTER SETTING
router.get('/', getAdminLoginPage)
router.get('/home', getAdminHomePage)

router.get('/products', getProductsPage)
router.get('/addproducts', getAddProducts)
router.get('/productedit/:id', getProductEdit)
router.get('/blockproduct/:id', blockProduct)
router.get('/unblockproduct/:id', unblockProduct)

router.get('/addcategory', getCategory)
router.get('/blockcategory/:id', blockCategory)
router.get('/unblockcategory/:id', unblockCategory)
router.get('/categoryedit/:id', getCategoryEdit)

router.get('/brand', getBrand)
router.get('/addbrand', getAddBrand)
router.get('/blockbrand/:id', blockBrand)
router.get('/unblockbrand/:id', unblockBrand)
router.get('/brandedit/:id', getBrandEdit)

router.get('/users', getUsers)
router.get('/blockuser/:id', blockUser)
router.get('/unblockuser/:id', unblockUser)

router.get('/banner', getBanner)
router.get('/addbanner', getAddBanner)
router.get('/deletebanner/:id', deleteBanner)


router.get('/coupon', getCoupon)
router.get('/addcupon', getAddCoupon)
router.get('/couponedit/:id', getCouponEdit)
router.get('/deletecoupon/:id', deleteCoupon)
router.get('/orders', orders)









router.post('/adminlogin', postAdminLogin)
router.post('/addproducts', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'subimage', maxCount: 3 }]), postAddProducts)
router.post('/productedit', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'subimage', maxCount: 3 }]), postProductEdit)
router.post('/addcategory', postAddCategory)
router.post('/categoryedit', postCategoryEdit)
router.post('/addbrand', upload.fields([{ name: 'image' }, { name: 'banner'}]), postAddBrand)
router.post('/brandedit', upload.fields([{ name: 'image' }, { name: 'banner'}]), postBrandEdit)
router.post('/addbanner', upload.single('image'), PostAddBanner)
router.post('/addcoupon', postAddCoupon)
router.post('/couponedit', postCouponEdit)

router.use(verifyAdmin)

module.exports = router;