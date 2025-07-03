import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  role: { type: String, default: 'user' },
  image: String,
});

export const User = mongoose.model('User', userSchema);
