const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userCallBacks = require("../controllers/user.js")

router.route("/signup")
.get(userCallBacks.signUpForm )
.post(userCallBacks.createUser)


let mid = passport.authenticate("local",{
    failureRedirect : "/login",
    failureFlash : true ,
})
router.route("/login")
.get(userCallBacks.logInForm)
.post( saveRedirectUrl,mid, userCallBacks.logInUser)

router.get("/logout",userCallBacks.logOutUser)

module.exports = router; 