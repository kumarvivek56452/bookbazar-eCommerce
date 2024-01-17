const express= require("express")
const route=express.Router();
const {isAuth, requireSignin}=require("../controllers/auth")
const {userById}=require("../controllers/user")
const {generateToken, processPayment}=require("../controllers/braintree")


route.get('/braintree/getToken/:userId',requireSignin, isAuth, generateToken)
route.post('/braintree/payment/:userId',requireSignin, isAuth, processPayment)

route.param("userId", userById)

module.exports=route