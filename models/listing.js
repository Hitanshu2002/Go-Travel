const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const newSchema = new Schema({
     title : {
          type: String,
          required : true
     },
     description : String,
     image : {
         url: {
          type:String,
          required: true
         },
         filename:{
          type:String,
          required:true
         }

     },
     price : {
          type: Number,
          required : true
     },
     location : {
          type: String,
          required : true
     },
     country : {
          type: String,
          required : true
     },
     reviews : [{
          type: Schema.Types.ObjectId,
          ref : "Review"
     }],
     owner : {
          type: Schema.Types.ObjectId,
          ref : "User"

     
},
    geometry : {
     type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
    


});

newSchema.post("findOneAndDelete",async(listing)=>{
     if(listing){
          await Review.deleteMany({_id : {$in: listing.reviews}})
     }
})

const Listing = mongoose.model("Listing",newSchema);
module.exports = Listing;