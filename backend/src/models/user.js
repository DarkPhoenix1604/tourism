import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
