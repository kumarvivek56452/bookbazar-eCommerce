const Product=require("../models/product")
const formidable=require("formidable")
const fs =require("fs")
const _ =require("lodash")
const { errorHandler } = require("../helpers/dbErrorHandler")
const { name } = require("ejs")
const product = require("../models/product")


exports.productById = (req, res, next, id)=>{
    
    Product.findById(id).populate("category").exec().then(product=>{
        req.product=product
        next();
    })
    .catch(err=>{
        if(err){
            return res.status(400).json({
                error: "Product not found"})
        }
    })
}


exports.read=(req, res)=>{
    req.product.photo=undefined;
    return res.json(req.product)
}

/////////////////////////////////////////////////////////////////////
exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        //check all fields:
        const {name,description,price, category,quantity,shipping} = fields
        if (!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: "All fields are required"
            });
        }



        let product = new Product(fields);

        if (files.photo) {
            //check for size
        if(files.photo.size>1000000){
            return res.status(400).json({
                error: "Image could not be uploaded"})
        }
            try {
                product.photo.data = fs.readFileSync(files.photo.filepath);
                product.photo.contentType = files.photo.mimetype;
            } catch (readErr) {
                console.error("Error reading file:", readErr);
                return res.status(400).json({
                    error: "Error reading file"
                });
            }
        }

        product.save()
            .then(savedProduct => {
                res.json(savedProduct);
            })
            .catch(saveErr => {
                console.error("Error saving product:", saveErr);
                return res.status(400).json({
                    error: errorHandler(saveErr)
                });
            });
    });
};

//////////////////////////////////////////////////////////////////////////

exports.remove=(req, res)=>{
    let product=req.product
    
    product.deleteOne().then(deletedProduct=>{
        res.json({deletedProduct,"message":"Product succesfully deleted"})
    })
    .catch(err=>{
        return res.status(400).json({
            error: errorHandler(err)
        })
    })
}

/////////////////////////////////////////////////////////////////////

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        //check all fields:
        const {name,description,price, category,quantity,shipping} = fields
        if (!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: "All fields are required"
            });
        }



        let product = req.product;
        //using extend method from lodash
        product=_.extend(product,fields)

        if (files.photo) {
            //check for size
        if(files.photo.size>1000000){
            return res.status(400).json({
                error: "Image could not be uploaded"})
        }
            try {
                product.photo.data = fs.readFileSync(files.photo.filepath);
                product.photo.contentType = files.photo.mimetype;
            } catch (readErr) {
                console.error("Error reading file:", readErr);
                return res.status(400).json({
                    error: "Error reading file"
                });
            }
        }

        product.save()
            .then(savedProduct => {
                res.json(savedProduct);
            })
            .catch(saveErr => {
                console.error("Error saving product:", saveErr);
                return res.status(400).json({
                    error: errorHandler(saveErr)
                });
            });
    });
};


////////////////////////////////////////////////////////////////

//sell or arrival
//by sell = /products?sortBy=sold&order=desc&limit=4
//by arrival = /products?sortBy=createdAt&order=desc&limit=4
//If noparams then return all products  

//quering start

exports.list=(req, res)=>{
    let order=req.query.order ? req.query.order:"asc"
    let sortBy=req.query.sortBy ? req.query.sortBy: "_id"
    let limit = req.query.limit ? parseInt(req.query.limit): 6

    product.find()
            .select("-photo")// due to lengthy ans slow. Willuse another req. for product
            .populate("category")
            .sort([[sortBy,order]])
            .limit(limit)
            .exec().
            then(products=>{
                res.json(products)
            })
            .catch(err=>{
                req.status(400).json({
                    error:"Products not found"
                })
            })
}


//It will find products based on req product category
//other product that has same category will return

exports.listRelated=(req, res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit): 6
    //find all related product except itself
    Product.find({_id:{$ne:req.product},category:req.product.category})
    .limit(limit)
    .populate("category","_id name")
    .exec()
    .then(products=>{
        res.json(products)
    })
    .catch(err=>{
        return res.status(400).json({
            error:"Products not found"
        })
    })
}


exports.listCategories=(req,res)=>{
    //we don't use find
    Product.distinct("category",{})
    .then(categories=>{
        res.json(categories)
    })
    .catch(err=>{
        return res.status(400).json({
            error:"Categories not found"
        })
    })
}

//list by search

//list products by search
//we will implement product search in react frontend
//we will show categories in checkbox and price range in radio buttons
//we will make api request and shoe products to users based on ehat he want
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec()
        .then(data=>{
            res.json(data)
        })
        .catch(err=>{
            return res.status(400).json({
                error:"Products not found"
            })
        })
};

//////////////////////////////////////////////////////////////

exports.photo=(req, res, next)=>{
    if (req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}