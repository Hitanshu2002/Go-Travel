const Listing = require("../models/listing.js")
const mbxGeoCoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings})
  }

  module.exports.renderNewForm = (req,res)=>{
  
    res.render("listings/new.ejs")
  }

 module.exports.showListing =  async (req,res,next)=>{
    let {id} = req.params;
  const listing =  await Listing.findById(id).populate({path : "reviews" , populate :{path: "author"}}).populate("owner");
  if(!listing){
   req.flash("failure","listing not exist");
   res.redirect("/listings")
    
  }
  res.render("listings/show.ejs" , {listing});
 
}

module.exports.createListing =(async (req,res,next)=>{
   let response  =  await geocodingClient.forwardGeocode({
    query: req.body.location,
    limit: 1
  })
    .send()
   
    
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url,"..",filename)
  console.log(req.body)
  let {title,description,image,price,location,country} = req.body;
  let newListing = new Listing({
    title : title,
    description : description,
    image : image,
    price : price ,
    location : location,
    country : country
  })

 
  newListing.image = {url,filename};
  newListing.owner = req.user._id;
  newListing.geometry = response.body.features[0].geometry;
  console.log(response.body.features[0].geometry)
  await newListing.save()
  req.flash("success","new listing created successfully")

  res.redirect("/listings")
 
}) 

module.exports.editListingForm = async (req,res)=>{
  let {id} = req.params; 
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
 
}

module.exports.updateListing = async(req,res)=>{

  let {title,description,image,price,location,country} = req.body;
 
  let {id} = req.params;


    
    let k = await Listing.findByIdAndUpdate(id,{title:title,description:description,image:image,price:price,location:location,country:country})
    if(typeof req.file !== "undefined" ){
    let url = req.file.path;
    let filename = req.file.filename;
    k.image = {url,filename}
    await k.save()
    }
    req.flash("success","listing updated !")
    return res.redirect(`/listings/${id}`)
 
} 

module.exports.deleteListing = async (req,res)=>{
  let{id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","listing deleted !")

  res.redirect("/listings");
}