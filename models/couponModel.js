const mongoose= require("mongoose");

const couponschema= new mongoose.Schema({
    name:String,
    code:String
})

const couponModel= new mongoose.model('coupon',couponschema)
module.exports= couponModel