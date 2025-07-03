import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cors from "cors";
import exploreRoutes from "./routes/exploreRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import next from "next";
import webhookRoutes from './routes/webhook.js';

dotenv.config();

const PORT = process.env.PORT || 8000;
const dev = process.env.NODE_ENV !== "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextApp = next({ dev, dir: path.join(__dirname, "../../sierra") });
const handle = nextApp.getRequestHandler();

await connectDB();
await nextApp.prepare();

const app = express();

// --- CORRECT MIDDLEWARE ORDER ---

// 1. Define the webhook route FIRST. It has its own body parser (express.raw)
//    and must not be touched by express.json().
app.use('/webhook', webhookRoutes);

// 2. Now, set up middleware for all OTHER routes.
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json()); // This will now apply to all routes defined below.

// 3. Define your other API routes.
app.use("/api/explore", exploreRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/wishlist", wishlistRoutes);

// 4. Define the Next.js page handler as the final catch-all.
app.get("/", (req, res) => {
  res.redirect("/explore");
});

app.all("/*path", async (req, res) => { // Changed to "/*" to correctly catch all paths
  try {
    await handle(req, res);
  } catch (err) {
    console.error("SSR handler error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});