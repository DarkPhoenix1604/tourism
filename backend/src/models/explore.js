import mongoose from 'mongoose';

const exploreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  images: [String],
}, { timestamps: true });

const Explore = mongoose.model("Package", exploreSchema);

export default Explore;
