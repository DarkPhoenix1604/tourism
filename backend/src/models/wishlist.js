import mongoose from "mongoose"
const { Schema, models, model } = mongoose

const wishlistSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    placeName: {
      type: String,
      required: true,
      trim: true,
    },
    visitDate: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "wishlists",
    timestamps: true,
  }
)

const Wishlist = models.Wishlist || model("Wishlist", wishlistSchema)
export default Wishlist
