import express from "express"
import Booking from "../models/bookings.js"

const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body)
    await booking.save()
    res.status(201).json(booking)
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" })
  }
})

router.get("/user/:email", async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email }).sort({ paymentDate: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" })
  }
})

export default router
