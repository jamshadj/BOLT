const userModel=require('../models/UserModel');

async function checkUser(req,res,next) {

    const user=await userModel.findOne({_id:req.session.user?._id});
    req.user=user;
    if (user?.block) {
        req.session.user=null;
        return res.redirect('/login')
    }else{
        next()
    }
    
}

 
module.exports=checkUser; 