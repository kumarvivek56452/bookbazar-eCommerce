require('dotenv').config()
const express=require("express")
const mongoose=require("mongoose")
const morgan=require("morgan")
const bodyParser=require("body-parser")
const cookieParser=require("cookie-parser")
const cors=require("cors")
const expressValidator=require("express-validator")

//import routes
const authRoute=require("./routes/auth.js")
const userRoute=require("./routes/user.js")
const categoryRoute=require("./routes/category.js")
const productRoute=require("./routes/product.js")
const braintreeRoute=require("./routes/braintree.js")


//app
const app=express()

//db
mongoose.connect(process.env.DATABASE).then(()=>console.log("DB connected"))

//middlewares

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())

//Route Middleware
app.use("/api",authRoute) 
app.use("/api",userRoute)
app.use("/api",categoryRoute)
app.use("/api",productRoute)
app.use("/api",braintreeRoute)


const port=process.env.PORT
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})
