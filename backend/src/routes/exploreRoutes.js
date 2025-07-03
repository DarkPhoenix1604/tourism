import express from "express";
import Explore from "../models/explore.js";
import { User } from "../models/user.js"; // to check admin role

const router = express.Router();

// ✅ GET: All packages
router.get("/packages", async (req, res) => {
  try {
    const allPackages = await Explore.find();
    res.json(allPackages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET: Single package by ID
router.get("/packages/:id", async (req, res) => {
  try {
    const pkg = await Explore.findById(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ POST: Create new package (admin only)
router.post("/packages", async (req, res) => {
  try {
    const { name, description, price, images } = req.body;
    const requesterEmail = req.headers['x-user-email'];

    if (!requesterEmail) {
      return res.status(401).json({ error: "Missing user email in header" });
    }

    const user = await User.findOne({ email: requesterEmail });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    const newPackage = new Explore({ name, description, price, images });
    await newPackage.save();

    res.status(201).json(newPackage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
