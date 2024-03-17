const Listing = require("./models/listing.js")
const Review= require("./models/review.js")
module.exports.isLoggedIn = (req,res,next)=>{
   req.session.redirectUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("failure","you must be logged in ")
   return   res.redirect("/login")
      }
      next();
}

// because passport reset session 
module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next()

}

module.exports.isOwner = async (req,res,next)=>{
  let {id} = req.params;
    let listing = await Listing.findById(id);

   if(! req.user._id.equals(listing.owner)){
    req.flash("failure","you are not owner of this post ")
    return res.redirect(`/listings/${id}`)
   }
   next();
}

module.exports.isReviewAuthor = async (req,res,next) =>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)){
    req.flash("failure","you are not owner of this review ")
    return res.redirect(`/listings/${id}`)
  }
  next();
}