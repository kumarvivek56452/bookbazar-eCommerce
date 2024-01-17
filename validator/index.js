exports.userSignupValidator = (req, res, next) =>{
    req.check("name", "Name is Required").notEmpty()
    req.check("email", "Email must be between 3 to 32 characters").notEmpty();
    req.check("password","Password is required").notEmpty();
    req.check("password")
        .isLength({min:6})
        .withMessage("Password must contain atleast 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");
    const error = req.validationErrors()
    if(error){
        const FirstError= error.map(error => error.msg)[0];
        return res.status(400).json({error : FirstError})
    }
    next(); //kind of callback what will move to next whther succeded or failed
}