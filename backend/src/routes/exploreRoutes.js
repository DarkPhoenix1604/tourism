import express from "express";
import Explore from "../models/explore.js"; // Make sure this path is correct

const router = express.Router();

// ✅ Route: Get ALL packages
router.get("/packages", async (req, res) => {
  try {
    const allPackages = await Explore.find();
    res.json(allPackages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Route: Get package BY ID
router.get("/packages/:id", async (req, res) => {
  try {
    const pkg = await Explore.findById(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
