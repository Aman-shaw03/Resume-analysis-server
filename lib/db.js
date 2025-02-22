import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        if(conn){
            console.log(`MongoDB connected Successfully ${conn.connection.host}`);
            
        }else{console.log(`MongoDB connection failed`);
        }
    } catch (error) {
        console.log(`Couldn't Connect to MongoDB`, error);
    }
    
}