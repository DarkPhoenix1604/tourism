// backend/server.js (or index.js)

import express from "express"
import dotenv from "dotenv"
import connectDB from "./lib/db.js"
import cors from "cors"
import exploreRoutes from "./routes/exploreRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import wishlistRoutes from "./routes/wishlistRoutes.js"
import path from "path"
import { fileURLToPath } from "url"
import next from "next"

dotenv.config()

const PORT = process.env.PORT || 8000
const dev = process.env.NODE_ENV !== "production"

// Required to resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const nextApp = next({ dev, dir: path.join(__dirname, "../../sierra") })
const handle = nextApp.getRequestHandler()

await connectDB()

await nextApp.prepare()

const app = express()

app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.json())

// ✅ API Routes
app.use("/api/explore", exploreRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/wishlist", wishlistRoutes)

// ✅ Correct SSR handler for Next.js
app.all("/*path", async (req, res) => {
  try {
    await handle(req, res)
  } catch (err) {
    console.error("SSR handler error:", err)
    res.status(500).send("Internal Server Error")
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
