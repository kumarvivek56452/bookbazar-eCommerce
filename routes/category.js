const express= require("express")
const route=express.Router();

const { create, categoryById, read,update, remove, list }=require("../controllers/category")
const {requireSignin, isAuth, isAdmin}=require("../controllers/auth")
const {userById}=require("../controllers/user")


route.get("/category/:categoryId", read )
route.post("/category/create/:userId", requireSignin,isAuth, isAdmin, create);
route.put("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, update);
route.delete("/category/:categoryId/:userId", requireSignin,isAuth, isAdmin, remove);
route.get("/categories", list )

route.param("categoryId",categoryById)
route.param("userId",userById)

module.exports=route;