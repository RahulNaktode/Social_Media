import mongoose from "mongoose";
import dotenv from "dotenv";    

dotenv.config();

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL)

        if(conn){
            console.log("Connected to MongoDB");
        }
    }catch(error){
        console.error("Error connecting to MongoDB:", error.message);
    }
}

export default connectDB;