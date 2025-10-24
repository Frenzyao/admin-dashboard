import mongoose from "mongoose";
import dotenv from "dotenv";
import Data from "./models/Data.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const sampleData = [
  { category: "Sales", value: 120 },
  { category: "Marketing", value: 90 },
  { category: "Development", value: 150 },
  { category: "Support", value: 70 },
];

const importData = async () => {
  try {
    await Data.deleteMany(); // clears existing data
    await Data.insertMany(sampleData);
    console.log("✅ Sample data inserted");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
