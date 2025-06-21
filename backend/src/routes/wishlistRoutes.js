import express from "express"
import Wishlist from "../models/wishlist.js"

const router = express.Router()

// POST /api/wishlist
router.post("/", async (req, res) => {
  try {
    const { email, places } = req.body

    if (!email || !places || !Array.isArray(places)) {
      return res.status(400).json({ error: "Invalid request body" })
    }

    const created = await Promise.all(
      places.map((place) =>
        Wishlist.create({
          userEmail: email,
          placeName: place.name,
          visitDate: place.visitDate,
        })
      )
    )

    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to add place(s)" })
  }
})

// GET /api/wishlist/user/:email
router.get("/user/:email", async (req, res) => {
  try {
    const list = await Wishlist.find({ userEmail: req.params.email }).sort({ visitDate: 1 })
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch wishlist" })
  }
})

// POST /api/wishlist/delete
router.post("/delete", async (req, res) => {
  try {
    const { email, placeName } = req.body

    if (!email || !placeName) {
      return res.status(400).json({ error: "Missing email or placeName" })
    }

    const deleted = await Wishlist.findOneAndDelete({ userEmail: email, placeName })

    if (!deleted) {
      return res.status(404).json({ error: "Place not found" })
    }

    res.status(200).json({ message: "Place deleted" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to delete wishlist item" })
  }
})

// POST /api/wishlist/update
router.post("/update", async (req, res) => {
  try {
    const { email, placeName, visitDate } = req.body

    if (!email || !placeName || !visitDate) {
      return res.status(400).json({ error: "Missing fields" })
    }

    const updated = await Wishlist.findOneAndUpdate(
      { userEmail: email, placeName },
      { visitDate: new Date(visitDate) },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ error: "Place not found" })
    }

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to update place" })
  }
})

export default router
