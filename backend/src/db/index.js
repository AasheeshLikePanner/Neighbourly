import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';


console.log("Function runs");

export const connectDB = async () => {
    let flag = false;
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\nMongoDb connected!! Db Host: ${connectionInstance.connection.host}`);
    flag = true;
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
  console.log('Process Runs', flag);
};