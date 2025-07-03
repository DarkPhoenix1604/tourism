import express from 'express';
import { Webhook } from 'clerk-sdk-node';
import { connectToDB } from '../lib/db.js';
import { User } from '../models/user.js';

const router = express.Router();
const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET;

router.post('/clerk', express.raw({ type: '*/*' }), async (req, res) => {
  const rawBody = req.body.toString('utf8');
  const signature = req.headers['clerk-signature'];

  try {
    const webhook = new Webhook(clerkWebhookSecret);
    const evt = webhook.verifySignature(rawBody, signature);

    if (evt.type === 'user.created') {
      const email = evt.data.email_addresses?.[0]?.email_address;

      if (!email) return res.status(400).json({ error: 'Email not found' });

      await connectToDB();

      await User.findOneAndUpdate(
        { email },
        { email, role: 'user' },
        { upsert: true, new: true }
      );

      return res.status(200).json({ message: 'User saved' });
    }

    return res.status(200).json({ message: 'Event ignored' });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).send('Invalid signature');
  }
});

export default router;
