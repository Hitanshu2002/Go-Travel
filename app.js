if(process.env.NODE_EVN != "production"){
    require("dotenv").config();
}
console.log(process.env.SECRET)

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js")
const reviews = require("./routes/reviews.js")
const session = require("express-session")
const MongoStore = require('connect-mongo')
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const users = require("./routes/user.js")

// database connection
let dbUrl = process.env.ATLASDB_URL;

main()
.then(res=>console.log("mongo is working"))
.catch(err=>console.log(err))
async function main(){
    await mongoose.connect(dbUrl);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.engine("ejs",ejsMate);


let store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600
});

store.on("error",()=>{
    console.log("error in mongoStore")
})
let sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
       expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
       maxAge : 7 * 24 * 60 * 60 * 1000,
       httpOnly : true
    }
}

app.use(express.urlencoded({extended : true}))
app.use(express.json());
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"/public")));
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure")
    res.locals.currUser = req.user;
    next();
})


//connection establish
app.listen(8080,()=>{
    console.log("server is listening ...");
})

//checking home route
// app.get("/",(req,res)=>{
//    res.send("working")
// })

//user
app.use("/",users)

// all listings
app.use("/listings",listings);

//all reviews
app.use("/listings/:id/reviews",reviews);




// page not exist route
app.get("*",(req,res,next)=>{
 throw new ExpressError(404,"page not found")
})


//middleware for handle the errors
app.use((err,req,res,next)=>{
 let {statusCode=500,message="error"} = err;
  res.status(statusCode).render("Error.ejs" ,{message});
}) 
