import mongoose from "mongoose";
import { MONGO_URI } from "../environments";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI as string);
    console.log("✅ MongoDB connected:", connection.connection.host);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
