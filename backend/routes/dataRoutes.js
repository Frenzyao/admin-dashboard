import express from "express";
import Data from "../models/Data.js";

const router = express.Router();

// Get all data (for charts)
router.get("/", async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add data
router.post("/", async (req, res) => {
  try {
    const { category, value } = req.body;
    const newData = new Data({ category, value });
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
