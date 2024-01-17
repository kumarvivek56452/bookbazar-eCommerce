const User=require("../models/user")
const {errorHandler}=require("../helpers/dbErrorHandler")
const jwt = require("jsonwebtoken")//to generate signed token
const expressjwt=require("express-jwt")//for authoerization check

exports.signup=(req, res)=>{
    console.log("req body", req.body)
    const user=new User(req.body)
    console.log(user)
    user.save()
  .then(savedUser => {
    console.log("Saved")
    user.salt=undefined,
    user.hashed_password=undefined //undefinded to hide both in robo3T database
    res.json({ user: savedUser });
  })
  .catch(error => {
    console.log("err",error)
    res.status(400).json({ err:errorHandler(error) });
  });
}

////////////////////////////////////////////////////////////////  

exports.signin = (req, res)=>{
    //find user based on email
    const{email,password}=req.body
    console.log(req.body)
    User.findOne({ email })
    .exec()
    .then(user => {
        if (!user) {
            return res.status(400).json({
                err: "User with that email does not exist. Please sign up"
            });
        }

        // If the user is found, then make sure the email and password match
        // Create an authenticate method in the user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password don't match"
            });
        } else {
            console.log("All things are correct");
        }

        // Generate a signed token with the user ID and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        // Persist the token "t" in a cookie with an expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });

        // Return a response with user and token to the frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message || "Internal Server Error" });
    }); 
}

/////////////////////////////////////////////////////////////////////////

exports.signout = (req, res) =>{
    res.clearCookie("t")
    res.json({message:"Signout Successfull"})
}


/////////////////////////////////////////////////////////////////////////

exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    userProperty:"auth"
})


////////////////////////////////////////////////////////////////////////////

exports.isAuth = (req,res,next,id) =>{
    user=User.findById(id)
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    console.log("profile",req.profile)
    console.log("auth",req.auth)
    console.log("profid",profile._id)
    console.log("authid",auth._id)
    if(!user){
        return res.status(403).json({
            error:"Access denied"
        })
    }
    next();
}

// exports.isAuth=(req, res, next, id)=>{
//     User.findById(id).then(user=>{
//         const isAuthorized = req.profile && req.auth && req.profile._id.equals(req.auth._id);
//         if (!isAuthorized) {
//             return res.status(403).json({
//               error: "Access denied"
//             });
//           }      
//     }).catch(err=>{
//         return res.status(403).json({
//             error: "Access denied"
//     })})

// }

exports.isAdmin = (req,res,next) =>{
    if(req.profile.role===0){
        return res.status(403).json({
            error:"Admin resource! Access denied"
        });
    }
    next();
}