import express from "express";
import Booking from "../models/bookings.js";
import { User } from "../models/user.js"; // if you want admin check

const router = express.Router();

// ✅ Create a new booking
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// ✅ Get all bookings for a specific user
router.get("/user/:email", async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email }).sort({ paymentDate: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// ✅ Get all bookings (optional: admin-only)
router.get("/all", async (req, res) => {
  try {
    const requesterEmail = req.headers["x-user-email"];

    // Optional: Only allow admins to fetch all bookings
    if (!requesterEmail) {
      return res.status(401).json({ error: "Missing user email in header" });
    }

    const user = await User.findOne({ email: requesterEmail });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    const allBookings = await Booking.find().sort({ paymentDate: -1 });
    res.json(allBookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all bookings" });
  }
});

export default router;
