const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn} = require("../middleware.js")
const {isOwner} = require("../middleware.js")
const listingCallBacks = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingCallBacks.index))





  // new route
  router.get("/new",isLoggedIn,listingCallBacks.renderNewForm)


  router.post("/",isLoggedIn,upload.single("image"),wrapAsync(listingCallBacks.createListing))
  
 router.route("/:id")
.get(wrapAsync(listingCallBacks.showListing))
.patch(isLoggedIn,isOwner,upload.single("image"),wrapAsync(listingCallBacks.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingCallBacks.deleteListing))
  
  //edit route
  router.get("/:id/edit",isLoggedIn,wrapAsync(listingCallBacks.editListingForm))
  
 


module.exports = router;