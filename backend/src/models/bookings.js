import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
  invoiceId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Package" },
  paymentMethod: { type: String, required: true },
  paymentAmount: { type: Number, required: true },
  bookingDate: { type: Date, required: true },
  paymentDate: { type: Date, required: true },
  numPeople: { type: Number, required: true },
  packageName: { type: String },
  userEmail: { type: String, required: true },
})

export default mongoose.model("Booking", bookingSchema)
