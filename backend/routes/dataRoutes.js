import express from "express";
import Data from "../models/Data.js";

const router = express.Router();

// GET all data
router.get("/", async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new data
router.post("/", async (req, res) => {
  try {
    const { category, value } = req.body;
    if (!category || value == null) {
      return res.status(400).json({ message: "Category and value are required" });
    }

    const newData = new Data({ category, value });
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a single item
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Data.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE all data
router.delete("/", async (req, res) => {
  try {
    await Data.deleteMany();
    res.json({ message: "All data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
