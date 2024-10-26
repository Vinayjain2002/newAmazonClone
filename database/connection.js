import mongoose from"mongoose";
import dotenv from "dotenv"

dotenv.config();
const connection_url=process.env.MONGO_URL || "mongodb://localhost:27017";

const connectDB= ()=>{
    try{
        // definning the url to connect with teh database
        mongoose.connect(connection_url);
        console.log("Connected to Database");
    }   
    catch(err){
        console.log("Error while Connecting to the database");
    }
}

export default connectDB;