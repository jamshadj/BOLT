const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  newbrands: { 
    type: String, 
    required: true
   },
   block:{
    type:Boolean,
    required:true
  }
});

const brandModel = new mongoose.model("NewBrand", brandSchema);
module.exports = brandModel;
