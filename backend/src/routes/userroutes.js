import express from 'express';
import { User } from '../models/user.js'; // adjust path as needed

const router = express.Router();

// GET /api/users — fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
