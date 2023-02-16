const express = require("express");
const adminModel = require("../models/adminModel");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const brandModel = require("../models/brandModel");
const usermodel = require("../models/UserModel");
const bannerModel = require("../models/bannerModel");
const couponModel = require("../models/couponModel");

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

const postAddProducts = (req, res) => {
  let block = false;
  const { productname, category, brand, quantity, prize, MRP, description } =
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
    image: req.files.image[0],
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

 
};

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

  if (req.files?.image && req.files?.subimage) {
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
            image: req.files.image[0],
            subimage: req.files.subimage,
          },
        }
      )
      .lean();
    return res.redirect("/admin/products");
  }
  if (!req.files?.image && req.files?.subimage) {
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
            subimage: req.files.subimage,
          },
        }
      )
      .lean();
    return res.redirect("/admin/products");
  }
  if (!req.files?.image && !req.files?.subimage) {
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
          },
        }
      )
      .lean();
    return res.redirect("/admin/products");
  }
  if (req.files?.image && !req.files?.subimage) {
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
            image: req.files.image[0],
          },
        }
      )
      .lean();
    return res.redirect("/admin/products");
  }
};

//BLOCK PRODUCT
const blockProduct = async (req, res) => {
  let proid = req.params.id;
  productModel.findByIdAndUpdate(
    { _id: proid },
    { $set: { block: true } },
    function (err, data) {
      if (err) {
        res.redirect("/admin/products");
      } else {
        res.redirect("/admin/products");
      }
    }
  );
};
//unblock PRODUCT
const unblockProduct = async (req, res) => {
  let proid = req.params.id;
  productModel.findByIdAndUpdate(
    { _id: proid },
    { $set: { block: false } },
    function (err, data) {
      if (err) {
        res.redirect("/admin/products");
      } else {
        res.redirect("/admin/products");
      }
    }
  );
};

//ADD CATEGORY
const getCategory = async (req, res) => {
  let category = await categoryModel.find().lean();
  if (req.session.admin) {
    res.render("admin/AddCategory", { category,msg });
  } else {
    res.redirect('/admin')
  }
 
};

const postAddCategory = async (req, res) => {
  let block = false;
  let existingCategories = await categoryModel.findOne({
    newcategories: req.body.newcategories,
  });
  if (existingCategories) {
    msg ="category is already added"
   res.redirect('/admin/addcategory')
  } else {
    const { newcategories } = req.body;
    let NewCategories = new categoryModel({ newcategories, block });
    NewCategories.save((err, data) => {
      if (err) { 
        msg ="Sorry there is an error"
        res.redirect('/admin/addcategory')
      } else {
        res.redirect("/admin/addcategory");
      }
    });
  }
};

//BLOCK CATEGORY
const blockCategory = async (req, res) => {
  let proid = req.params.id;
  categoryModel.findByIdAndUpdate(
    { _id: proid },
    { $set: { block: true } },
    function (err, data) {
      if (err) {
        res.redirect("/admin/addcategory");
      } else {
        res.redirect("/admin/addcategory");
      }
    }
  );
};
//unblock CATEGORY
const unblockCategory = async (req, res) => {
  let proid = req.params.id;
  categoryModel.findByIdAndUpdate(
    { _id: proid },
    { $set: { block: false } },
    function (err, data) {
      if (err) {
        res.redirect("/admin/addcategory");
      } else {
        res.redirect("/admin/addcategory");
      }
    }
  );
};

//EDIT CATEGORY
const getCategoryEdit = async (req, res) => {
  let catId = req.params.id;
  let category = await categoryModel.findOne({ _id: catId }).lean();
  if (req.session.admin) {
    res.render("admin/categoryEdit", { category });
  } else {
    res.redirect('/admin')
  }
  
};

const postCategoryEdit = async (req, res) => {
  const { newcategories, _id } = req.body;

  await categoryModel
    .findByIdAndUpdate(
      { _id },
      {
        $set: {
          newcategories,
        },
      }
    )
    .lean();
  res.redirect("/admin/Addcategory");
};

//BRAND
const getBrand = async (req, res) => {
  let brands = await brandModel.find().lean();
  if (req.session.admin) {
    res.render("admin/brand", { brands });
  } else {
    res.redirect('/admin')
  }
 
};

//add brand
const postAddBrand = async (req, res) => {
  let block = false;
  let existingbrand = await brandModel.findOne({
    newbrands: req.body.newbrands,
  });
  if (existingbrand) {
    msg="Brand is already exist"
    res.redirect('/admin/addbrand')
  } else {
    console.log('hi');
    const { newbrands } = req.body;
    let NewBrands = new brandModel({ newbrands, block,image:req.files.image[0],banner:req.files.banner[0]});
    NewBrands.save((err, data) => {
      if (err) {
        console.log(err);
        msg ="Error on adding product"
        res.redirect('/admin/addbrand')
      } else {
        console.log("suces");
        res.redirect("/admin/brand");
      }
    });
  }
};

//BLOCK BRAND
const blockBrand = async (req, res) => {
  let braid = req.params.id;
  brandModel.findByIdAndUpdate(
    { _id: braid },
    { $set: { block: true } },
    function (err, data) {
      if (err) {
        res.redirect("/admin/brand");
      } else {
        res.redirect("/admin/brand");
      }
    }
  );
};
//unblock BRAND
const unblockBrand = async (req, res) => {
  let braid = req.params.id;
  brandModel.findByIdAndUpdate(
    { _id: braid },
    { $set: { block: false } },
    function (err, data) {
      if (err) {
        res.redirect("/admin/brand");
      } else {
        res.redirect("/admin/brand");
      }
    }
  );
};
//Edit brand
const getBrandEdit = async (req, res) => {
  let braId = req.params.id;
  let brand = await brandModel.findOne({ _id: braId }).lean();
  if (req.session.admin) {
    res.render("admin/brandEdit", { brand });
  } else {
    res.redirect('/admin')
  }

};

const postBrandEdit = async (req, res) => {
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
  }else if (req.files?.image && !req.files?.banner) {
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
  }
   else {
  
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
}


const getAddBrand= (req,res)=>{
  if (req.session.admin) {
    res.render('admin/addbrand')
  } else {
    res.redirect('/admin')
  }
 
 
}

//USER
const getUsers = async (req, res) => {
  let usersdetails = await usermodel.find().lean();
  if (req.session.admin) {
    res.render("admin/users", { usersdetails });
  } else {
    res.redirect("/admin")
  }
 
};

//BLOCK USER
const blockUser = async (req, res) => {
  let UserId = req.params.id;
  usermodel.findByIdAndUpdate(
    { _id: UserId },
    { $set: { block: true } },
    function (err, data) {
      if (err) {
        res.redirect("/admin/users");
      } else {
        res.redirect("/admin/users");
      }
    }
  );
};
//unblock USER
const unblockUser = async (req, res) => {
  let braid = req.params.id;
  usermodel.findByIdAndUpdate(
    { _id: braid },
    { $set: { block: false } },
    function (err, data) {
      if (err) {
        res.redirect("/admin/users");
      } else {
        res.redirect("/admin/users");
      }
    }
  );
};

//BANNER
const getBanner = async (req, res) => {
  let banner = await bannerModel.find().lean();
  if (req.session.admin) {
    res.render("admin/banner", { banner });
  } else {
    res.redirect('/admin')
  }
 
};
const getAddBanner = (req, res) => {
  if (req.session.admin) {
    res.render("admin/Addbanner");
  } else {
    res.redirect('/admin')
  }
 
};

const PostAddBanner = (req, res) => {
  const { name, description } = req.body;

  let banner = new bannerModel({
    name,
    description,
    image: req.file,
  });
  banner.save((err, data) => {
    if (err) {
      res.send("err" + err);
    } else {
      console.log("saved");
      res.redirect("/admin/banner");
    }
  });
};

const deleteBanner = async (req, res) => {
  const banId = req.params.id;
  console.log(banId);
  await bannerModel.findByIdAndRemove({ _id: banId }).lean();
  res.redirect("/admin/banner");
};

//COUPON
const getCoupon = async (req, res) => {
  let coupon = await couponModel.find().lean();
  if (req.session.admin) {
    res.render("admin/coupon", { coupon });
  } else {
    res.redirect('/admin')
  }
 
};
const getAddCoupon = (req, res) => {
  if (req.session.admin) {
    res.render("admin/addCoupon");
  } else {
    res.redirect("/admin")
  }
 
};
//add coupon
const postAddCoupon = async (req, res) => {
  const { name, code } = req.body;
  let coupon = await new couponModel({
    name,
    code,
  });
  coupon.save((err, date) => {
    if (err) {
      res.send("err" + err);
    } else {
      console.log("coupon saved");
      res.redirect("/admin/coupon");
    }
  });
};
//edit coupon
const getCouponEdit = async (req, res) => {
  let copId = req.params.id;
  let coupon = await couponModel.findOne({ _id: copId }).lean();
  if (req.session.admin) {
    res.render("admin/couponEdit", { coupon });
  } else {
    res.redirect("/admin")
  }
 
};

const postCouponEdit = async (req, res) => {
  const { name, code, _id } = req.body;
  await couponModel.findByIdAndUpdate(
    { _id },
    {
      $set: {
        name,
        code,
      },
    }
  );
  res.redirect("/admin/coupon");
};

//delete coupon
const deleteCoupon = async (req, res) => {
  const copId = req.params.id;
  await couponModel.findByIdAndRemove({ _id: copId }).lean();
  res.redirect("/admin/coupon");
};

const orders = (req, res) => {
  if (req.session.admin) {
    res.render("admin/orders");
  } else {
    res.redirect('/admin')
  }
  
};

module.exports = {
  getAdminLoginPage,postAdminLogin,
  getAdminHomePage,

  //product
  getProductsPage, 
  getAddProducts,postAddProducts, 
  getProductEdit,postProductEdit, 
  blockProduct,unblockProduct,

  //category
  getCategory,postAddCategory,
  blockCategory,unblockCategory,
  getCategoryEdit,postCategoryEdit,
 
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
  deleteCoupon,

  
  
  orders, 
};
