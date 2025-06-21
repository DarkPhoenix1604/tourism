import express from "express"
import dotenv from "dotenv"
import connnectDB from "./lib/db.js"
import cors from "cors"
import exploreRoutes from "./routes/exploreRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import wishlistRoutes from "./routes/wishlistRoutes.js"


dotenv.config()

const PORT = process.env.PORT || 8000

const app = express()
await connnectDB()

app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.json())

// Routes
app.use("/api/explore", exploreRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/wishlist", wishlistRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
