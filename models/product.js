const mongoose=require("mongoose")
const Schema =mongoose.Schema

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxlength:32,
        required:true,
        unique:true
    },
    description:{
        type:String,
        maxlength:2000,
        required:true
    },
    price:{
        type:Number,
        trim:true,
        maxlength:32,
        required:true
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category",   //Creating relationship between two model
        required:true
    },
    quantity:{
        type:Number
    },
    sold:{
        type:Number,
        default:0
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    shipping:{
          required:false,
          type:Boolean
    }
},{timestamps:true})

productSchema.index({ name: 1 }, { unique: true });



module.exports=mongoose.model("Product",productSchema)
 