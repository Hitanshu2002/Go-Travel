const User = require("../models/user.js")

module.exports.signUpForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.createUser = async (req,res)=>{
    try{
        let {email,username,password} = req.body;
        let newUser = new User({email,username});
        let registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err)
            }
            req.flash("success",`welcome ${username} in Airbnb`)
            res.redirect("/listings")
        })
       
    }catch(e){
       req.flash("failure",e.message)
       res.redirect("/signup")
    }
   
}
module.exports.logInForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.logInUser = async (req,res)=>{
    
    let {username} = req.body;
    req.flash("success",`welcome back ${username}`);
    if(res.locals.redirectUrl)
    res.redirect(res.locals.redirectUrl)
    else
    res.redirect("/listings")
}

module.exports.logOutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","successfully logged out")
         res.redirect("/listings")
    })
}