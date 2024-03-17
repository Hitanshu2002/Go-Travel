const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); 

let MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
async function main(){
    await mongoose.connect(MONGO_URL);
}
main()
.then(res=>console.log("mongo is working"))
.catch(err=>console.log(err))

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"65edfb9a8cf60283c523b585"}))
    initData.data = initData.data.map((obj)=>({...obj,geometry : { type: 'Point', coordinates: [ 75.166133, 26.899175 ] }}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
initDB();