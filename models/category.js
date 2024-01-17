const mongoose=require("mongoose")

const categorySchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxlength: [32, "Name must be at most 32 characters"],
        required: [true, "Name is required"]
    },
},{timestamps:true})

categorySchema.index({ name: 1 }, { unique: true });

module.exports=mongoose.model("Category",categorySchema)