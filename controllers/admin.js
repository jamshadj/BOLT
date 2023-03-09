const express = require("express");
const adminModel = require("../models/adminModel");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const brandModel = require("../models/brandModel");
const usermodel = require("../models/UserModel");
const bannerModel = require("../models/bannerModel");
const couponModel = require("../models/couponModel");
const orderModel=require("../models/orderModel");
const sharp = require("sharp");

//ADMIN


const getAdminLoginPage = (req, res) => {
  if (req.session.admin) {
    res.redirect("admin/home")
  } else {
    if (msg == undefined) {
      msg == null;
    } else { 
      msg == msg;
    }
    res.render("admin/AdminLogin", { CSS: ["stylesheet/adminlogin.css"], msg });
    msg = null;
  }
 
};

const getAdminHomePage = (req, res) => {
  if (req.session.admin) {
    res.render("admin/Adminhome", { CSS: ["stylesheet/style.css"] });
  } else {
    res.redirect("/admin");
  }
}


var msg;

const postAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  const adminmail = await adminModel.findOne({ email: email });

  if (adminmail) {
    if (password == adminmail.password) {
      req.session.admin=true
      res.redirect("/admin/home");
    } else {
      msg = "Password incorrect"; 
      res.redirect("/admin"); 
    }
  } else {
    msg = "check email and password"; 
    res.redirect("/admin");
  }
};


//PRODUCT

const getProductsPage = async (req, res) => {
  let productsdetail = await productModel.find().lean();
  if (req.session.admin) {
    res.render("admin/products", { productsdetail ,msg});
  } else {
    res.redirect('/admin')
  }
 
};
//ADD PRODUCT
const getAddProducts = async (req, res) => {
  let category = await categoryModel.find().lean();
  let brands = await brandModel.find().lean();
  if (req.session.admin) {
    res.render("admin/addProduct", { category, brands,msg });
  } else {
    res.redirect('/admin')
  }
 
};


const postAddProducts = async (req, res) => {
  let block = false;
  const { productname, category, brand, quantity, prize, MRP, description } = req.body;
    
  await sharp(req.files.image[0].path)
                .png()
                .resize(250, 250, {
                    kernel: sharp.kernel.nearest,
                    fit: 'contain',   
                    position: 'center',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .toFile(req.files.image[0].path + ".png")
            req.files.image[0].filename = req.files.image[0].filename + ".png"
            req.files.image[0].path = req.files.image[0].path + ".png"

  
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
    subimage: req.files.subimage,
  });

  products.save((err, data) => {
    if (err) {
      msg =err
      console.log(err);
      res.redirect("/admin/addproducts")
    } else {
      console.log("saved");
      res.redirect("/admin/products");
    }
  });
}



//EDIT PRODUCT
const getProductEdit = async (req, res) => {
  let proid = req.params.id;
  let category = await categoryModel.find().lean();
  let brands = await brandModel.find().lean();
  let product = await productModel.findOne({ _id: proid }).lean();

  if (req.session.admin) {
    res.render("admin/productedit", { product, category, brands });
  } else {
    res.redirect('/admin')
  }
  
};



const postProductEdit = async (req, res) => {
  const {
    productname,
    category,
    brand,
    quantity,
    prize,
    description,
    MRP,
    _id,
  } = req.body;

  try {
    let product;
    if (req.files?.image && req.files?.subimage) {
      product = await productModel.updateOne(
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
            image: req.files.image[0],
            subimage: req.files.subimage,
          },
        }
      );
    } else if (!req.files?.image && req.files?.subimage) {
      product = await productModel.updateOne(
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
            subimage: req.files.subimage,
          },
        }
      );
    } else if (!req.files?.image && !req.files?.subimage) {
      product = await productModel.updateOne(
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
          },
        }
      );
    } else if (req.files?.image && !req.files?.subimage) {
      product = await productModel.updateOne(
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
            image: req.files.image[0],
          },
        }
      );
    }
    return res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

const deleteProductMainImage = async (req, res) => {
  try {
    const id = req.params.id;
    await productModel.findByIdAndUpdate(id, { $unset: { image: 1 } });
    res.redirect("/admin/productedit/" + id);
  } catch (err) {
    console.error(err);
    res.redirect("/admin/productedit/" + id);
  }
};

const deleteProductSubImage=async(req,res)=>{

}

//BLOCK PRODUCT
const blockProduct = async (req, res) => {
  try {
    const proid = req.params.id;
    await productModel.findByIdAndUpdate(
      { _id: proid },
      { $set: { block: true } }
    );
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    res.redirect("/admin/products");
  }
};
//unblock PRODUCT
const unblockProduct = async (req, res) => {
  try {
    const proid = req.params.id;
    await productModel.findByIdAndUpdate(
      { _id: proid },
      { $set: { block: false } }
    );
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    res.redirect("/admin/products");
  }
};


//ADD CATEGORY
const getCategory = async (req, res) => {
  try {
    const category = await categoryModel.find().lean();
    if (req.session.admin) {
      res.render("admin/AddCategory", { category, msg });
    } else {
      res.redirect('/admin');
    }
  } catch (err) {
    console.error(err);
    const msg = "Sorry, there was an error";
    res.render("admin/AddCategory", { category: [], msg });
  }
};

const postAddCategory = async (req, res) => {
  try {
    const { newcategory } = req.body;
    const categorycheck = newcategory.trim();
    const existingCategories = await categoryModel.findOne({
      newcategories: { $regex: new RegExp(`^${categorycheck}$`, 'i') }
    });

    if (existingCategories) {
       msg = "Category is already added";
      res.redirect('/admin/AddCategory');
    } else {
      const NewCategories = new categoryModel({ newcategories: categorycheck, block: false });
      await NewCategories.save();
      res.redirect('/admin/AddCategory');
    }
  } catch (err) {
    console.error(err);
    const msg = "Sorry, there was an error";
    res.render('admin/AddCategory', { msg });
  }
};

//BLOCK CATEGORY
const blockCategory = async (req, res) => {
  try {
    const proid = req.params.id;
    await categoryModel.findByIdAndUpdate(
      { _id: proid },
      { $set: { block: true } }
    );
    res.redirect("/admin/addcategory");
  } catch (err) {
    res.redirect("/admin/addcategory");
  }
};

const unblockCategory = async (req, res) => {
  try {
    const proid = req.params.id;
    await categoryModel.findByIdAndUpdate(
      { _id: proid },
      { $set: { block: false } }
    );
    res.redirect("/admin/addcategory");
  } catch (err) {
    res.redirect("/admin/addcategory");
  }
};

const getCategoryEdit = async (req, res) => {
  try {
    const catId = req.params.id;
    const category = await categoryModel.findOne({ _id: catId }).lean();
    if (req.session.admin) {
      res.render("admin/categoryEdit", { category });
    } else {
      res.redirect('/admin');
    }
  } catch (err) {
    console.error(err);
    res.redirect('/admin/addcategory');
  }
};

const postCategoryEdit = async (req, res) => {
  try {
    const { newcategories, _id } = req.body;
    await categoryModel.findByIdAndUpdate(
      { _id },
      { $set: { newcategories } }
    );
    res.redirect("/admin/Addcategory");
  } catch (err) {
    console.error(err);
    res.redirect('/admin/addcategory');
  }
};

//BRAND
const getBrand = async (req, res) => {
  try {
    let brands = await brandModel.find().lean();
    if (req.session.admin) {
      res.render("admin/brand", { brands });
    } else {
      res.redirect('/admin')
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const getAddBrand= (req,res)=>{
  try {
    if (req.session.admin) {
      res.render('admin/addbrand',{msg})
    } else {
      res.redirect('/admin')
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}

const postAddBrand = async (req, res) => {
  try {
    let block = false;
    const { brand } = req.body;
    const brandcheck = brand.trim();
    const existingBrand = await brandModel.findOne({
      newbrands: { $regex: new RegExp(`^${brandcheck}$`, 'i') }
    });

    if (existingBrand) {
      console.log("Brand already exists");
      res.redirect('/admin/addbrand');
      return;
    }

    const newbrands = brandcheck;
    let NewBrands = new brandModel({
      newbrands,
      block,
      image: req.files.image[0],
      banner: req.files.banner[0]
    });
    await NewBrands.save();
    console.log("Success");
    res.redirect("/admin/brand");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};


//BLOCK BRAND
const blockBrand = async (req, res) => {
  try {
    let braid = req.params.id;
    await brandModel.findByIdAndUpdate(
      { _id: braid },
      { $set: { block: true } }
    );
    res.redirect("/admin/brand");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const unblockBrand = async (req, res) => {
  try {
    let braid = req.params.id;
    await brandModel.findByIdAndUpdate(
      { _id: braid },
      { $set: { block: false } }
    );
    res.redirect("/admin/brand");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

//Edit brand
const getBrandEdit = async (req, res) => {
  try {
    let braId = req.params.id;
    let brand = await brandModel.findOne({ _id: braId }).lean();
    if (req.session.admin) {
      res.render("admin/brandEdit", { brand });
    } else {
      res.redirect('/admin')
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const postBrandEdit = async (req, res) => {
  try {
    const { newbrands, _id } = req.body;

    if (req.files?.image && req.files?.banner) {
      let brand=await brandModel
      .findByIdAndUpdate(
        { _id },
        {
          $set: {
            newbrands,
            image: req.files.image[0],
            banner: req.files.image[0],
          },
        }
      )
      .lean();
      return res.redirect("/admin/brand");
    } else if (!req.files?.image && req.files?.banner) {
      let brand=await brandModel
      .findByIdAndUpdate(
        { _id },
        {
          $set: {
            newbrands,
            banner: req.files.image[0],
          },
        }
      )
      .lean();
      return res.redirect("/admin/brand");
    } else if (req.files?.image && !req.files?.banner) {
      let brand=await brandModel
      .findByIdAndUpdate(
        { _id },
        {
          $set: {
            newbrands,
            image: req.files.image[0],
          },
        }
      )
      .lean();
      return res.redirect("/admin/brand");
    } else {
      let brand= await brandModel
      .findByIdAndUpdate(
        { _id },
        {
          $set: {
            newbrands
          },
        }
      )
      .lean();
      res.redirect("/admin/brand");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};



//USER
const getUsers = async (req, res) => {
  try {
    let usersdetails = await usermodel.find().lean();
    if (req.session.admin) {
      res.render("admin/users", { usersdetails });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

// BLOCK USER
const blockUser = async (req, res) => {
  try {
    let UserId = req.params.id;
    await usermodel.findByIdAndUpdate(
      { _id: UserId },
      { $set: { block: true } }
    );
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
//unblock USER
const unblockUser = async (req, res) => {
  try {
    let braid = req.params.id;
    await usermodel.findByIdAndUpdate(
      { _id: braid },
      { $set: { block: false } },
    );
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

//BANNER
const getBanner = async (req, res) => {
  try {
    let banner = await bannerModel.find().lean();
    if (req.session.admin) {
      res.render("admin/banner", { banner });
    } else {
      res.redirect('/admin');
    }
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
};

const getAddBanner = (req, res) => {
  if (req.session.admin) {
    res.render("admin/Addbanner");
  } else {
    res.redirect('/admin');
  }
};
const PostAddBanner = (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate image file type
    if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png') {
      throw new Error('Only JPEG and PNG images are allowed');
    }


    let banner = new bannerModel({
      name,
      description,
      image: req.file,
    });
    banner.save((err, data) => {
      if (err) {
        console.log(err);
        res.send("err" + err);
      } else {
        console.log("saved");
        res.redirect("/admin/banner");
      }
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
};

const deleteBanner = async (req, res) => {
  try {
    const banId = req.params.id;
    console.log(banId);
    await bannerModel.findByIdAndRemove({ _id: banId }).lean();
    res.redirect("/admin/banner");
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
};

//COUPON
const getCoupon = async (req, res) => {
  try {
    let coupon = await couponModel.find().lean();
    if (req.session.admin) {
      res.render("admin/coupon", { coupon });
    } else {
      res.redirect('/admin')
    }
  } catch (err) {
    res.status(500).send("Error retrieving coupons: " + err);
  }
};
 
const getAddCoupon = (req, res) => {
  if (req.session.admin) {
    res.render("admin/addCoupon");
  } else {
    res.redirect("/admin")
  }
};
 

const postAddCoupon = async (req, res) => {
  const {name, code, discount, expiration_date, minimum_purchase_amount, maximum_uses } = req.body;
  try {
    const coupon = new couponModel({
      name,
      code,
      discount,
      expiration_date,
      minimum_purchase_amount,
      maximum_uses
    });
    await coupon.save();
    console.log("Coupon saved");
    res.redirect("/admin/coupon");
  } catch (err) {
    res.status(500).send("Error saving coupon: " + err);
  }
};

//edit coupon
const getCouponEdit = async (req, res) => {
  try {
    const copId = req.params.id;
    const coupon = await couponModel.findOne({ _id: copId }).lean();
    if (req.session.admin) {
      res.render("admin/couponEdit", { coupon });
    } else {
      res.redirect("/admin")
    }
  } catch (err) {
    res.status(500).send("Error retrieving coupon: " + err);
  }
};

const postCouponEdit = async (req, res) => {
  const { name, code, _id,discount,expiration_date,minimum_purchase_amount,maximum_uses} = req.body;
  try {
    await couponModel.findByIdAndUpdate(
      { _id },
      {
        $set: {
          name,
          code,
          discount,
          expiration_date,
          minimum_purchase_amount,
          maximum_uses
        },
      }
    );
    res.redirect("/admin/coupon");
  } catch (err) {
    res.status(500).send("Error updating coupon: " + err);
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const copId = req.params.id;
    await couponModel.findByIdAndRemove({ _id: copId }).lean();
    res.redirect("/admin/coupon");
  } catch (err) {
    res.status(500).send("Error deleting coupon: " + err);
  }
};
   
//order

const getOrdersPage =async (req, res) => {

  if (req.session.admin) {
    let orders=await orderModel.find().lean()
    res.render("admin/orders",{orders});
  } else {
    res.redirect('/admin')
  }  
};


const getOrderStatusEdit = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId).lean();
    const orderStatusOptions = orderModel.schema.path('orderStatus').enumValues;

    res.render('admin/orderStatusEdit', {
      order,
      orderStatusOptions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// const Order = require('../models/orderModel'); // import Order model

const postOrderStatusEdit = async (req, res) => {
  try {
    const { orderStatus, _id } = req.body;

    // find the order by id and update its status
    const order = await orderModel.findByIdAndUpdate(
      _id,
      { orderStatus },
      { new: true } // return the updated order
    );


    // redirect to the orders page
    return res.redirect('/admin/orders');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
};

const adminLogout= async(req,res)=>{
  req.session.destroy()
  res.redirect('/admin')
}



module.exports = {
  getAdminLoginPage,postAdminLogin,
  getAdminHomePage,

  //product
  getProductsPage, 
  getAddProducts,postAddProducts, 
  getProductEdit,postProductEdit, 
  blockProduct,unblockProduct,deleteProductMainImage,

  //category
  getCategory,postAddCategory,
  blockCategory,unblockCategory,
  getCategoryEdit,postCategoryEdit,adminLogout,
 
  //brand
  getBrand,
  getAddBrand,postAddBrand,
  blockBrand,unblockBrand,
  getBrandEdit,postBrandEdit,

  //user
  getUsers,
  blockUser,unblockUser,

  //banner
  getBanner,
  getAddBanner,PostAddBanner,
  deleteBanner,

  //coupon
  getCoupon,
  getAddCoupon,postAddCoupon,
  getCouponEdit,postCouponEdit,
  deleteCoupon,deleteProductSubImage,


  //order
  getOrdersPage,getOrderStatusEdit,postOrderStatusEdit
};
