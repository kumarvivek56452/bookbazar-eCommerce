const express= require("express")
const route=express.Router();
const {signup,signin,signout, requireSignin}=require("../controllers/auth")
const {userSignupValidator} = require("../validator/index");


route.post("/signup",userSignupValidator,signup);
route.post("/signin",signin);
route.post("/signout",signout)


module.exports=route