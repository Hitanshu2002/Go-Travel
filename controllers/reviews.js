const Listing = require("../models/listing.js")
const Review = require("../models/review.js")

module.exports.createReview = async(req,res)=>{
    let {id} = req.params;
    let listing =await  Listing.findById(id);
 
   let review = new Review(req.body)
    review.author = req.user._id
 
    listing.reviews.push(review);
    await listing.save();
    await review.save();
    req.flash("success","review created !")
   res.redirect(`/listings/${id}`)
   
 }
 module.exports.deleteReview = async (req,res)=>{
    let{id,reviewId} = req.params;
     await Listing.findByIdAndUpdate(id,{$pull: {reviews : reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash("success","review deleted !")
     res.redirect(`/listings/${id}`)
   
   }