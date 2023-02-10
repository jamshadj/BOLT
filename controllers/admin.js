const express = require("express");
const adminModel = require("../models/adminModel");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const brandModel = require("../models/brandModel");
const usermodel = require("../models/UserModel");
const bannerModel=require("../models/bannerModel")
const couponModel=require("../models/couponModel")

const AdminLoginPage = (req, res) => {
  if (msg == undefined) {
    msg == null;
  } else {
    msg == msg;
  }
  res.render("admin/AdminLogin", { CSS: ["stylesheet/adminlogin.css"], msg });
  msg = null;
};

const AdminhomePage = (req, res) => {
  res.render("admin/Adminhome", { CSS: ["stylesheet/style.css"] });
};

//PRODUCT
 

const getProductsPage = async (req, res) => {
  let productsdetail = await productModel.find().lean();
  res.render("admin/products", { productsdetail });
};
//ADD PRODUCT
const getAddProducts = async (req, res) => {
  let category = await categoryModel.find().lean();
  let brands = await brandModel.find().lean();
  res.render("admin/addProduct", { category, brands });
};

const PostAddProducts = (req, res) => {
  let block=false
  const { productname, category, brand, quantity, prize,MRP, description} =
    req.body;
  let products = new productModel({
    productname,
    category,
    brand,
    quantity,
    prize,
    MRP,
    description,
    block,
    image:req.files.image[0],
    subimage:req.files.subimage
  });

  products.save((err, data) => {
    if (err) {
      res.send("err" + err);
    } else {
      console.log("saved");
      res.redirect("/admin/products");
    }
  });

  console.log("sucessfully added product");
};

//EDIT PRODUCT
const getproductedit = async (req, res) => {
  let category = await categoryModel.find().lean();
  let brands = await brandModel.find().lean();
  let proid = req.params.id;
  console.log(proid);
  let product = await productModel.findOne({ _id: proid }).lean();
  console.log(product);
  res.render("admin/productedit", { product, category, brands });
};

const postProductEdit = async (req, res) => {
  const { productname, category, brand, quantity, prize, description,MRP, _id} =
    req.body;
  

  if(req.files?.image && req.files?.subimage){

    let product = await productModel
    .updateOne(
      { _id},
      {
        $set: {
          productname,
          category,
          brand,
          quantity,
          prize,
          MRP,
          description,
          image:req.files.image[0],
          subimage:req.files.subimage
        },
      }
    )
    .lean();
  return res.redirect("/admin/products");
}
  if(!req.files?.image && req.files?.subimage){

    let product = await productModel
    .updateOne(
      { _id },
      {
        $set: {
          productname,
          category,
          brand,
          quantity,
          prize,
          MRP,
          description,
          subimage:req.files.subimage
        },
      }
    )
    .lean();
  return res.redirect("/admin/products");
}
  if(!req.files?.image && !req.files?.subimage){

    let product = await productModel
    .updateOne(
      { _id },
      {
        $set: {
          productname,
          category,
          brand,
          quantity,
          prize,
          MRP,
          description
        },
      }
    )
    .lean();
  return res.redirect("/admin/products");
}
if(req.files?.image && !req.files?.subimage){

  let product = await productModel
  .updateOne(
    { _id },
    {
      $set: {
        productname,
        category,
        brand,
        quantity,
        prize,
        MRP,
        description,
        image:req.files.image[0]
      },
    }
  )
  .lean();
return res.redirect("/admin/products");
}
};

//BLOCK PRODUCT
const blockproduct=async(req,res)=>{
  let proid = req.params.id;
  productModel.findByIdAndUpdate({_id:proid},{ $set: { block: true } },
    function (err, data) {
        if (err) {
            res.redirect('/admin/products')
        } else {
            res.redirect('/admin/products')
        }
    })
}
//unblock PRODUCT
const unblockproduct=async(req,res)=>{
  let proid = req.params.id;
  productModel.findByIdAndUpdate({_id:proid},{ $set: { block: false } },
    function (err, data) {
        if (err) {
            res.redirect('/admin/products')
        } else {
            res.redirect('/admin/products')
        }
    })
}



//ADD CATEGORY
const getcategory = async (req, res) => {
  let category = await categoryModel.find().lean();
  res.render("admin/AddCategory", { category });
};

const postAddCategory = async(req, res) => {
  let block=false;
  let existingCategories=await categoryModel.findOne({newcategories:req.body.newcategories})
  if (existingCategories) {
    res.send(" existing categories");
  } else {
    const { newcategories } = req.body;
    let NewCategories = new categoryModel({ newcategories,block });
    NewCategories.save((err, data) => {
      if (err) {
        console.log("err" + err);
      } else {
        res.redirect("/admin/addcategory");
      }
    });
  }
};

//BLOCK CATEGORY
const blockcategory=async(req,res)=>{
  let proid = req.params.id;
  categoryModel.findByIdAndUpdate({_id:proid},{ $set: { block: true } },
    function (err, data) {
        if (err) {
            res.redirect('/admin/addcategory')
        } else {
            res.redirect('/admin/addcategory')
        }
    })
}
//unblock CATEGORY
const unblockcategory=async(req,res)=>{
  let proid = req.params.id;
 categoryModel.findByIdAndUpdate({_id:proid},{ $set: { block: false } },
    function (err, data) {
        if (err) {
            res.redirect('/admin/addcategory')
        } else {
            res.redirect('/admin/addcategory')
        }
    })
}

//EDIT CATEGORY
const getCategoryEdit=async(req,res)=>{
   let catId=req.params.id
  let category=await categoryModel.findOne({_id:catId}).lean()
   res.render('admin/categoryEdit',{category})
}

const postCategoryEdit= async(req,res)=>{
   const {newcategories,_id}= req.body

  await categoryModel.findByIdAndUpdate({_id},{$set:{
    newcategories
  }}).lean();
  res.redirect("/admin/Addcategory");
}

//BRAND
const getbrand = async (req, res) => {
  let brands = await brandModel.find().lean();

  res.render("admin/AddBrand", { brands });
};

//add brand
const postbrand =async(req, res) => {
  let block=false;
  let existingbrand=await brandModel.findOne({newbrands:req.body.newbrands})
  if (existingbrand) {
    res.send("exisist brand");
  } else {
    const { newbrands } = req.body;
    let NewBrands = new brandModel({ newbrands,block });
    NewBrands.save((err, data) => {
      if (err) {
        console.log("err" + err);
      } else {
        console.log("suces");
        res.redirect("/admin/addbrand");
      }
    });
  }
};

//BLOCK BRAND
const blockBrand=async(req,res)=>{
  let braid = req.params.id;
  brandModel.findByIdAndUpdate({_id:braid},{ $set: { block: true } },
    function (err, data) {
        if (err) {
            res.redirect('/admin/addbrand')
        } else {
            res.redirect('/admin/addbrand')
        }
    })
}
//unblock BRAND
const unblockBrand=async(req,res)=>{
  let braid = req.params.id;
 brandModel.findByIdAndUpdate({_id:braid},{ $set: { block: false } },
    function (err, data) {
        if (err) {
            res.redirect('/admin/addbrand')
        } else {
            res.redirect('/admin/addbrand')
        }
    })
}
//Edit brand
const getBrandEdit=async(req,res)=>{
  let braId=req.params.id
 let brand=await brandModel.findOne({_id:braId}).lean()
  res.render('admin/brandEdit',{brand})
}

const postBrandEdit= async(req,res)=>{
  const {newbrands,_id}= req.body

 await brandModel.findByIdAndUpdate({_id},{$set:{
   newbrands
 }}).lean();
 res.redirect("/admin/Addbrand");
}

//USER
const users = async (req, res) => {
  let usersdetails = await usermodel.find().lean();
  res.render("admin/users", { usersdetails });
};

//BLOCK USER
const blockUser=async(req,res)=>{
  let UserId = req.params.id;
  usermodel.findByIdAndUpdate({_id:UserId},{ $set: { block: true } },
    function (err, data) {
        if (err) {
            res.redirect('/admin/users')
        } else {
            res.redirect('/admin/users')
        }
    })
}
//unblock USER
const unblockUser=async(req,res)=>{
  let braid = req.params.id;
 usermodel.findByIdAndUpdate({_id:braid},{ $set: { block: false } },
    function (err, data) {
        if (err) {
            res.redirect('/admin/users')
        } else {
            res.redirect('/admin/users')
        }
    })
}


//BANNER
const getbanner = async(req, res) => {
  let banner=await bannerModel.find().lean()
  res.render("admin/banner",{banner});
}; 
const addbanner=(req,res)=>{
  res.render("admin/Addbanner")
}

const PostAddbanner=(req,res)=>{
  const {name,description}=req.body;

  let banner= new bannerModel({
    name,description, image:req.file
  })
  banner.save((err, data) => {
    if (err) {
      res.send("err" + err);
    } else {
      console.log("saved");  
      res.redirect("/admin/banner");
    }
  }); 
}

const deleteBanner=async(req,res)=>{
  const banId=req.params.id
  console.log(banId);
  await bannerModel.findByIdAndRemove({_id:banId}).lean()
  res.redirect('/admin/banner')

}


//COUPON
const getcoupon=async(req,res)=>{
  let coupon=await couponModel.find().lean()
  res.render("admin/coupon",{coupon})
} 
const getaddCoupon=(req,res)=>{
  res.render("admin/addCoupon")
}
//add coupon
const postAddCoupon=async(req,res)=>{
    const {name,code}=req.body;
    let coupon=await new couponModel({
      name,code
    })
    coupon.save((err,date)=>{
      if (err) {
        res.send("err"+err)
      } else {
        console.log('coupon saved');
        res.redirect("/admin/coupon")
      }
    })
}
//edit coupon
const getCouponEdit=async(req,res)=>{
 let copId=req.params.id;
 let coupon=await couponModel.findOne({_id:copId}).lean()
 res.render('admin/couponEdit',{coupon})
}

const postCouponEdit=async(req,res)=>{
   const {name,code,_id}=req.body;
   await couponModel.findByIdAndUpdate({_id},{$set:{
    name,code
   }})
   res.redirect("/admin/coupon")
}

//delete coupon
const deleteCoupon=async(req,res)=>{
  const copId=req.params.id
  await couponModel.findByIdAndRemove({_id:copId}).lean()
  res.redirect('/admin/coupon')

}

var msg;

const AdminLogin = async (req, res) => {
  const { email, password } = req.body;
  const adminmail = await adminModel.findOne({ email: email });

  if (adminmail) {
    if (password == adminmail.password) {
      res.redirect("/admin/home");
    } else {
      msg = "check email and password"; 
      res.redirect("/admin");
    }
  } else {
    msg = "check email and password";
    res.redirect("/admin");
  }
};







const orders = (req, res) => {
  res.render("admin/orders");
};








module.exports = {
  AdminLoginPage,
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
  postbrand,
  blockBrand,
  unblockBrand,
  getbrand,
  getBrandEdit,
  postBrandEdit,
  orders,
  users,
  blockUser,
  unblockUser,



  
  
 
  
 

  getbanner,
  addbanner,
  PostAddbanner,
  deleteBanner,
  getcoupon,
  getaddCoupon,
  postAddCoupon,
  getCouponEdit,
  postCouponEdit,
  deleteCoupon

 
  
};
