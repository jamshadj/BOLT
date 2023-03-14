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

// Define function to render the Admin login page

let msg=null;

const getAdminLoginPage = (req, res) => {
  if (req.session.admin) {
    res.redirect("admin/home"); // Redirect to admin home page if already logged in
  } else {
    if (msg == undefined) {
    } else { 
      msg = msg; // Set message to the value of msg if defined
    }
    res.render("admin/AdminLogin", { CSS: ["stylesheet/adminlogin.css"], msg }); // Render the Admin login page with any messages
    msg = null; // Reset the message after rendering the page
  } 
};

// Define function to render the Admin home page
const getAdminHomePage = (req, res) => {
  if (req.session.admin) {
    res.render("admin/Adminhome", { CSS: ["stylesheet/style.css"] }); // Render the Admin home page if logged in
  } else {
    res.redirect("/admin"); // Redirect to the Admin login page if not logged in
  }
}

// Define function to handle Admin login form submission
const postAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  const adminmail = await adminModel.findOne({ email: email });

  if (adminmail) {
    if (password == adminmail.password) {
      req.session.admin = true; // Set session variable to indicate successful login
      res.redirect("/admin/home"); // Redirect to the Admin home page if login successful
    } else {
      msg = "Password incorrect"; // Set error message if password is incorrect
      res.redirect("/admin"); // Redirect to the Admin login page
    }
  } else {
    msg = "Check email and password"; // Set error message if email is not found
    res.redirect("/admin"); // Redirect to the Admin login page
  }
};


const adminLogout= async(req,res)=>{
  req.session.destroy()
  res.redirect('/admin')
}


//Product Management 


// Define function to render the Products page
const getProductsPage = async (req, res) => {
  let productsdetail = await productModel.find().lean();
  if (req.session.admin) {
    res.render("admin/products", { productsdetail, msg });
  } else {
    res.redirect('/admin');
  }
};

// Define function to render the Add Product page
const getAddProducts = async (req, res) => {
  let category = await categoryModel.find().lean();
  let brands = await brandModel.find().lean();
  if (req.session.admin) {
    res.render("admin/addProduct", { category, brands, msg });

  } else {
    res.redirect('/admin');
  }
};
const postAddProducts = async (req, res) => {
  let block = false;
  const { productname, category, brand, quantity, prize, MRP, description } = req.body;

  try {
    let products;
    if (req.files?.image && req.files?.subimage) {
      await sharp(req.files.image[0].path)
        .png()
        .resize(250, 250, {
          kernel: sharp.kernel.nearest,
          fit: 'contain',
          position: 'center',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(req.files.image[0].path + ".png");
      req.files.image[0].filename = req.files.image[0].filename + ".png";
      req.files.image[0].path = req.files.image[0].path + ".png";
      products = new productModel({
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
    } else if (!req.files?.image && req.files?.subimage) {
      products = new productModel({
        productname,
        category,
        brand,
        quantity,
        prize,
        MRP,
        description,
        block,
        subimage: req.files.subimage,
      });
    } else if (!req.files?.image && !req.files?.subimage) {
      products = new productModel({
        productname,
        category,
        brand,
        quantity,
        prize,
        MRP,
        description,
        block,
      });
    } else if (req.files?.image && !req.files?.subimage) {
      await sharp(req.files.image[0].path)
        .png()
        .resize(250, 250, {
          kernel: sharp.kernel.nearest,
          fit: 'contain',
          position: 'center',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(req.files.image[0].path + ".png");
      req.files.image[0].filename = req.files.image[0].filename + ".png";
      req.files.image[0].path = req.files.image[0].path + ".png";
      products = new productModel({
        productname,
        category,
        brand,
        quantity,
        prize,
        MRP,
        description,
        block,
        image: req.files.image[0],
      });
    }
    await products.save();
    console.log("saved");
    return res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
   msg= "Please ensure that all details entered are correct.";

    return res.redirect("/admin/addproducts");
  }
};


// GET method for product edit page
const getProductEdit = async (req, res) => {
  let proid = req.params.id;
  let category = await categoryModel.find().lean();
  let brands = await brandModel.find().lean();
  let product = await productModel.findOne({ _id: proid }).lean();

  if (req.session.admin) {
    res.render("admin/productedit", { product, category, brands, msg });
   
  } else {
    res.redirect('/admin')
  }
};

// POST method for product edit page
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

    // Validate image
    if (req.files?.image) {
      const image = req.files.image[0];
      const validExtensions = [".jpg", ".jpeg", ".png",".webp"];
      const fileExtension = path.extname(image.originalname).toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        throw new Error("Invalid image file type");
      }
    }

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
   msg=" Please check the fields and ensure that they are correct. If the issue persists, please contact the system administrator for further assistance."
    return res.status(500).send("Internal Server Error");
  }
};

// DELETE method for deleting product's main image
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
// BLOCK PRODUCT
const blockProduct = async (req, res) => {
  try {
  const productId = req.params.id;
  await productModel.findByIdAndUpdate(
  { _id: productId },
  { $set: { block: true } }
  );
  res.redirect("/admin/products");
  } catch (error) {
  console.error(error);
  res.redirect("/admin/products");
  }
  };
  
  // UNBLOCK PRODUCT
  const unblockProduct = async (req, res) => {
  try {
  const productId = req.params.id;
  await productModel.findByIdAndUpdate(
  { _id: productId },
  { $set: { block: false } }
  );
  res.redirect("/admin/products");
  } catch (error) {
  console.error(error);
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
   msg = "Sorry, there was an error";
  res.render("admin/AddCategory", { category: [],msg});
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
        console.log("hrr");
        msg = "The category you are trying to add already exists.";
        console.log(msg);
        res.redirect('/admin/AddCategory');
      } else {
        const newCategories = new categoryModel({ newcategories: categorycheck, block: false });
        await newCategories.save();
        res.redirect('/admin/AddCategory');
      }
    } catch (err) {
      console.error(err);
      msg = "Sorry, there was an error adding the category. Please try again later";
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

//Retrieve all brands from the database and render the brand page
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

//Render the add brand page
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

//Add a new brand to the database
const postAddBrand = async (req, res) => {
  try {
    let block = false;
    const { brand } = req.body;
    const brandcheck = brand.trim();
    const existingBrand = await brandModel.findOne({
      newbrands: { $regex: new RegExp(`^${brandcheck}$`, 'i') }
    });

    //Check if the brand already exists, if it does redirect back to the add brand page
    if (existingBrand) {
      console.log("Brand already exists");
      msg ="The category you are trying to add already exists."
      res.redirect('/admin/addbrand');
      return;
    }

    const newbrands = brandcheck;
    let NewBrands = new brandModel({
      newbrands,
      block,
      image: req.files.image[0], //Get the image file from the request
      banner: req.files.banner[0] //Get the banner file from the request
    });
    await NewBrands.save();
    console.log("Success");
    res.redirect("/admin/brand");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

//Block a brand in the database
const blockBrand = async (req, res) => {
  try {
    let braid = req.params.id;
    await brandModel.findByIdAndUpdate(
      { _id: braid },
      { $set: { block: true } }
    );
    res.redirect("/admin/brand");
  } catch (error) {
    msg=error;
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

//Unblock a brand in the database
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

    let updateObject = {
      $set: {
        newbrands
      }
    };

    if (req.files?.image && req.files?.banner) {
      updateObject.$set.image = req.files.image[0];
      updateObject.$set.banner = req.files.image[0];
    } else if (!req.files?.image && req.files?.banner) {
      updateObject.$set.banner = req.files.image[0];
    } else if (req.files?.image && !req.files?.banner) {
      updateObject.$set.image = req.files.image[0];
    }

    let brand = await brandModel.findByIdAndUpdate({ _id }, updateObject).lean();
    res.redirect("/admin/brand");

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};


// Get all users
const getUsers = async (req, res) => {
  try {
    let users = await usermodel.find().lean();
    if (req.session.admin) {
      res.render("admin/users", { users });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

// Block user
const blockUser = async (req, res) => {
  try {
    let userId = req.params.id;
    await usermodel.findByIdAndUpdate(
      { _id: userId },
      { $set: { block: true } }
    );
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

// Unblock user
const unblockUser = async (req, res) => {
  try {
    let userId = req.params.id;
    await usermodel.findByIdAndUpdate(
      { _id: userId },
      { $set: { block: false } },
    );
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
//BANNER

// Retrieve all banners
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

// Render add banner form
const getAddBanner = (req, res) => {
  if (req.session.admin) {
    res.render("admin/Addbanner", {msg});
   msg=null;
  } else {
    res.redirect('/admin');
  }
};


// Add a new banner
const PostAddBanner = (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate image file type
    if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/webp') {
      throw new Error('Only JPEG, PNG, and WEBP images are allowed');
    }
    

    // Create new banner instance
    let banner = new bannerModel({
      name,
      description,
      image: req.file,
    });

    // Save banner to database
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
   msg=err
    res.redirect('/admin/Addbanner');
  }
};

// Delete a banner by ID
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
// Get all coupons from the database
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
 
// Render the add coupon page
const getAddCoupon = (req, res) => {
  if (req.session.admin) {
    res.render("admin/addCoupon" ,{msg});
    msg=null;
  } else {
    res.redirect("/admin")
  }
};
 
const postAddCoupon = async (req, res) => {
  const { name, code, discount, expiration_date, minimum_purchase_amount, maximum_uses } = req.body;
  try {
    // Check if a coupon with the same name already exists
    const existingCoupon = await couponModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    if (existingCoupon) {
      // If a coupon with the same name exists, redirect back to the add coupon page with an error message
      msg = "Coupon name already exists";
      return res.redirect('/admin/addCoupon');
    }
    // Check if the expiration_date is before today
    if (new Date(expiration_date) < new Date()) {
      // If the expiration_date is before today, redirect back to the add coupon page with an error message
      msg = "Expiration date must be after today";
      return res.redirect('/admin/addCoupon');
    }
    // Create a new coupon object and save it to the database
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
    // Redirect to the coupon page after successfully adding a new coupon
    res.redirect("/admin/coupon");
  } catch (err) {
    // Handle errors when adding a new coupon
    res.status(500).send("Error saving coupon: " + err);
  }
};


// Render the coupon edit page
const getCouponEdit = async (req, res) => {
  try {
    const copId = req.params.id;
    // Find the coupon to edit by its id
    const coupon = await couponModel.findOne({ _id: copId }).lean();
    if (req.session.admin) {
      res.render("admin/couponEdit", { coupon });
    } else {
      res.redirect("/admin")
    }
  } catch (err) {
    // Handle errors when retrieving the coupon to edit
    res.status(500).send("Error retrieving coupon: " + err);
  }
};

// Update an existing coupon in the database
const postCouponEdit = async (req, res) => {
  const { name, code, _id,discount,expiration_date,minimum_purchase_amount,maximum_uses} = req.body;
  try {
    // Find the coupon to update by its id and set the new values
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
    // Redirect to the coupon page after successfully updating the coupon
    res.redirect("/admin/coupon");
  } catch (err) {
    // Handle errors when updating the coupon
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
// Get all orders
const getAllOrders = async (req, res) => {
  try {
    // Check if user is authorized to access the admin panel
    if (!req.session.admin) {
      return res.redirect('/admin');
    }

    // Retrieve all orders from the database
    const orders = await orderModel.find().lean();

    // Render the orders page with the orders data
    res.render("admin/orders", { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Display the order status edit page
const displayOrderStatusEditPage = async (req, res) => {
  try {
    // Retrieve the order id from the request parameters
    const orderId = req.params.id;

    // Retrieve the order from the database using the id
    const order = await orderModel.findById(orderId).lean();

    // Retrieve the possible order status values from the order model schema
    const orderStatusOptions = orderModel.schema.path('orderStatus').enumValues;

    // Render the order status edit page with the order data and the order status options
    res.render('admin/orderStatusEdit', {
      order,
      orderStatusOptions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Update the order status
const updateOrderStatus = async (req, res) => {
  try {
    // Retrieve the new order status and the order id from the request body
    const { orderStatus, _id } = req.body;

    // Find the order by id and update its status
    const order = await orderModel.findByIdAndUpdate(
      _id,
      { orderStatus },
      { new: true } // return the updated order
    );

    // Redirect to the orders page
    res.redirect('/admin/orders');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


const getAdminSalesReport = async (req, res) => {
  const start = req.query.start;
  const end = req.query.end;
  let orders;
  let deliveredOrders;
  let salesCount;
  let salesSum;
  let result;
  
  if (start && end) {
    orders = await orderModel.find({ date: { $gte: start, $lt: end } }).lean();
    deliveredOrders = orders.filter(order => order.orderStatus === "delivered");
    salesCount = await orderModel.countDocuments({ orderDate: { $gte: start, $lt: end }, orderStatus: "delivered" });
    salesSum = deliveredOrders.reduce((acc, order) => acc + order.totalPrice, 0);
  } else {
    salesCount = await orderModel.countDocuments({ orderStatus: "delivered" });
    orders = await orderModel.find({ orderStatus: "delivered" }).lean();
    deliveredOrders = orders.filter(order => order.orderStatus === "delivered");
    result = await orderModel.aggregate([
      { $match: { orderStatus: "delivered" } },
      { $group: { _id: null, totalPrize: { $sum: "$totalPrice" } } }
    ]);
    salesSum = result.length > 0 ? result[0].totalPrize : 0;
  }
  
  const users = await orderModel.distinct('user');
  const userCount = users.length;
  console.log('orders:', orders);
  console.log('userCount:', userCount, 'salesCount:', salesCount, 'salesSum:', salesSum, 'deliveredOrders:', deliveredOrders);
  res.render('admin/adminSalesreport', { userCount, salesCount, salesSum, deliveredOrders });
};
const getAdminDashboard=async (req, res) => {
  try {
      const orderCount = await orderModel.countDocuments().lean();

      const deliveredOrders = await orderModel.find({ orderStatus: "delivered" }).lean();

      let totalRevenue = 0;
      let Orders = await Promise.all(deliveredOrders.map(async (item) => {
          totalRevenue = totalRevenue + item.totalPrice;
          return item;
      }));

      const monthlyDataArray = await orderModel.aggregate([
          { $match: { orderStatus: "delivered" } },
          {
              $addFields: {
                  orderDateConverted: {
                      $toDate: "$date"
                  }
              }
          },
          {
              $group: {
                  _id: { $month: "$orderDateConverted" },
                  sum: { $sum: "$totalPrice" }
              }
          },
      ]);

      const monthlyReturnArray = await orderModel.aggregate([
          {
              $match: { orderStatus: "Return" }
          },
          {
              $group: {
                  _id: { $month: "$date" },
                  sum: { $sum: "$totalPrice" }
              }
          }
      ]);

      let monthlyDataObject = {};
      let monthlyReturnObject = {}
      monthlyDataArray.map((item) => {
          monthlyDataObject[item._id] = item.sum;
      });
      monthlyReturnArray.map(item => {
          monthlyReturnObject[item._id] = item.sum
      })
      let monthlyReturn = []
      for (let i = 1; i <= 12; i++) {
          monthlyReturn[i - 1] = monthlyReturnObject[i] ?? 0
      }
      let monthlyData = [];
      for (let i = 1; i <= 12; i++) {
          monthlyData[i - 1] = monthlyDataObject[i] ?? 0;
      }
      const online = await orderModel.find({ paymentMethod: "Online-payment" }).countDocuments().lean();
      const cod = await orderModel.find({ paymentMethod: "COD" }).countDocuments().lean();
      
      const userCount = await usermodel.countDocuments().lean();
      const productCount = await productModel.countDocuments().lean();
      res.render("admin/Adminhome", {
          totalRevenue,
          orderCount,
          monthlyData,
          monthlyReturn,
          online,
          cod,
          productCount,
          userCount,
      });  
      // console.log( totalRevenue,
      //   orderCount,
      //   monthlyData,
      //   monthlyReturn,
      //   online,
      //   cod,
      //   productCount,
      //   userCount);
  } catch (error) {
      console.log(error)
  }
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
  getAdminSalesReport,
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
 getAllOrders,displayOrderStatusEditPage,updateOrderStatus,
  getAdminDashboard
};
