const express= require("express")
const route=express.Router();

const { create, productById, read ,remove, update, list, listRelated, listCategories, listBySearch,photo}=require("../controllers/product")
const {requireSignin, isAuth, isAdmin}=require("../controllers/auth")
const {userById}=require("../controllers/user")


route.get("/product/:productId", read)
route.post("/product/create/:userId", requireSignin,isAuth, isAdmin, create);
route.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, remove )
route.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, update )

route.get("/products", list)
route.get("/products/related/:productId", listRelated )
route.get("/products/categories", listCategories)
route.post("/products/by/search",listBySearch)
route.get("/product/photo/:productId", photo)

route.param("userId",userById)
route.param("productId",productById)

module.exports=route;