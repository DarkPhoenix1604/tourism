import express from "express";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Initialize Razorpay instance with your credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route to create Razorpay order
router.post("/", async (req, res) => {
  const { amount, currency = "INR" } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency,
      receipt: uuidv4(),
      payment_capture: 1, // Automatically capture payment
    });
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

export default router; // Export the router using ES module syntax
