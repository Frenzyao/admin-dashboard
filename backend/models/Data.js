import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  category: { type: String, required: true },
  value: { type: Number, required: true },
}, { timestamps: true });

const Data = mongoose.model("Data", dataSchema);

export default Data;
