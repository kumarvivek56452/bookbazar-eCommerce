const Category =require("../models/category")
const {errorHandler}=require("../helpers/dbErrorHandler")

exports.categoryById=(req,res,next,id)=>{
    Category.findById(id).exec().then(category=>{
        req.category=category
        next()
    }).catch(err=>{
        return res.status(400).json({
            error:"Category doesnot exisit"
        })
    })
}


exports.create =(req,res)=>{
    const category = new Category(req.body)
    
    category.save().then(data=>{
        res.json({data})
    })
    .catch(err=>{
        return res.status(400).json({
            error:errorHandler(err)
        })
    })
}

//////////////////////////////////////////////////////////////////

exports.read=(req,res)=>{
    return res.json(req.category);
}

exports.update=(req, res)=>{
    const category=req.category
    category.name=req.body.name
    category.save().then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(400).json({
            error:errorHandler(err)
        })
    }) 
}




exports.remove=(req, res)=>{
    const category=req.category
    category.deleteOne().then(data=>{
        res.json({message:"Category deleted successfully"})
    })
    .catch(err=>{
        res.status(400).json({
            error:errorHandler(err)
        })
    }) 
    
}


exports.list=(req, res)=>{
    Category.find().then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(400).json({
            error:errorHandler(err)
        })
    }) 
}
