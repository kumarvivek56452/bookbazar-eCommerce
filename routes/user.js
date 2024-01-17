const express= require("express")
const route=express.Router();
const {requireSignin, isAuth, isAdmin}=require("../controllers/auth")
const {userById, read, update}=require("../controllers/user")

route.get("/secret/:userId",requireSignin, isAuth, isAdmin  , (req, res)=>{
    res.json({
        user:req.profile
    })
})

route.get("/user/:userId", requireSignin, isAuth, read)
route.post("/user/:userId", requireSignin, isAuth, update)


route.param("userId",userById)


module.exports=route