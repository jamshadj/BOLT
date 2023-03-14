const express = require('express');
const router = express.Router();
const {
      // authentication
      getAdminLoginPage, postAdminLogin, getAdminHomePage,adminLogout,
    
      // product
      getProductsPage, getAddProducts, postAddProducts, getProductEdit, 
      postProductEdit, blockProduct, unblockProduct,deleteProductMainImage,
    
      // category
      getCategory, postAddCategory, getCategoryEdit, postCategoryEdit,
      blockCategory, unblockCategory,
    
      // brand
      getBrand, getAddBrand, postAddBrand, getBrandEdit, postBrandEdit,
      blockBrand, unblockBrand,
    
      // user
      getUsers, blockUser, unblockUser,
    
      // banner
      getBanner, getAddBanner, PostAddBanner, deleteBanner,
    
      // coupon
      getCoupon, getAddCoupon, postAddCoupon, getCouponEdit, 
      postCouponEdit, deleteCoupon,
    
      // orders
       getAdminSalesReport, getAdminDashboard, getAllOrders, displayOrderStatusEditPage, updateOrderStatus
    
      
    } = require('../controllers/admin');
    
const verifyAdmin = require('../middlewares/adminSession');
const upload = require('../middlewares/multer');


//ROUTER SETTING

// Admin Routes
router.get('/', getAdminLoginPage);
router.get('/home', getAdminDashboard);
router.post('/adminlogin', postAdminLogin)
router.get('/logout', adminLogout);

// Product Routes
router.get('/products', getProductsPage);
router.get('/addproducts', getAddProducts);
router.post('/addproducts', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'subimage', maxCount: 3 }]), postAddProducts);
router.get('/productedit/:id', getProductEdit);
router.post('/productedit', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'subimage', maxCount: 3 }]), postProductEdit);
router.get('/blockproduct/:id', blockProduct);
router.get('/unblockproduct/:id', unblockProduct);
router.get('/deleteimage/:id', deleteProductMainImage);

// Category Routes
router.get('/addcategory', getCategory);
router.post('/addcategory', postAddCategory);
router.get('/blockcategory/:id', blockCategory);
router.get('/unblockcategory/:id', unblockCategory);
router.get('/categoryedit/:id', getCategoryEdit);

router.post('/categoryedit', postCategoryEdit);    
// Brand Routes
router.get('/brand', getBrand);
router.get('/addbrand', getAddBrand);
router.post('/addbrand', upload.fields([{ name: 'image' }, { name: 'banner'}]), postAddBrand);
router.get('/blockbrand/:id', blockBrand);
router.get('/unblockbrand/:id', unblockBrand);
router.get('/brandedit/:id', getBrandEdit);
router.post('/brandedit', upload.fields([{ name: 'image' }, { name: 'banner'}]), postBrandEdit);

// User Routes
router.get('/users', getUsers);
router.get('/blockuser/:id', blockUser);
router.get('/unblockuser/:id', unblockUser);

// Banner Routes
router.get('/banner', getBanner);
router.get('/addbanner', getAddBanner);
router.post('/addbanner', upload.single('image'), PostAddBanner);
router.get('/deletebanner/:id', deleteBanner);

// Coupon Routes
router.get('/coupon', getCoupon);
router.get('/addcoupon', getAddCoupon);
router.post('/addcoupon', postAddCoupon);
router.get('/couponedit/:id', getCouponEdit);
router.post('/couponedit', postCouponEdit);
router.get('/deletecoupon/:id', deleteCoupon);

// Order Routes
router.get('/orders', getAllOrders);
router.get('/orderStatus/:id', displayOrderStatusEditPage);
router.post('/orderStatus',updateOrderStatus);
router.get('/salesreport',getAdminSalesReport)




router.use(verifyAdmin)

module.exports = router;