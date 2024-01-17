const User = require("../models/user.js")

exports.userById = (req, res, next, id) => {
    User.findById(id)
        .exec()
        .then(user => {
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }
            req.profile = user;
            console.log("show", req.profile);
            next();
        })
        .catch(err => {
            if (err.name === 'CastError') {
                return res.status(400).json({ error: "Invalid user ID" });
            }
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        });
};

////////////////////////////////////////////////////////////
//updating user profile

exports.read=(req, res)=>{
    req.profile.hashed_password=undefined
    req.profile.salt=undefined
    return res.json(req.profile)
}


exports.update=(req, res)=>{
    User.findOneAndUpdate({_id:req.profile._id},{$set:req.body},{new:true}).then(user=>{
        req.profile.hashed_password=undefined
        req.profile.salt=undefined
        res.json(user)
    })
    .catch(err=>{
        return res.status(400).json({
            error:"You are not authorized to perform this action"
        })
    })
}