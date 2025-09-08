const mongoose= require("mongoose");

const initData=require("./data.js");
const Listing=require("../models/listing.js");

if(process.env.NODE_ENV !="production")
{
require('dotenv').config();
}

main().
then(()=>{
    console.log("Connected to DB");}
).catch(err=>{
    console.log(err);
})

async function main(){
    const dbUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/Listings";
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("Existing data cleared");

  // Use the sample data as-is (without hardcoded owner for now)
  await Listing.insertMany(initData.data);
  console.log("Sample listings initialized!");
};

initDB().then(() => {
  mongoose.connection.close();
  console.log("Database connection closed");
}).catch(err => {
  console.error("Error initializing data:", err);
});