const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn,isReviewAuthor} = require("../middleware.js")
const reviewCallBacks = require("../controllers/reviews.js")

router.post("/",isLoggedIn,wrapAsync(reviewCallBacks.createReview))
 

 router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewCallBacks.deleteReview))

 module.exports = router;