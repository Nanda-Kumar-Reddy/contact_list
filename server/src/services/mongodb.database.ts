import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://nanda:nanda1234@businessprism.yxqlgtt.mongodb.net/?retryWrites=true&w=majority&appName=BusinessPrism';

mongoose.connection.once('open',() => {
  console.log('mongoose connection is ready')
})

mongoose.connection.on('error',(err) => {
  console.error(err)
})
const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" MongoDB Connected Successfully!");
  } catch (error) {
    console.error(" MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectMongoDB;
