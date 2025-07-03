import express from 'express';
import * as clerk from '@clerk/backend';
import connectDB from '../lib/db.js'; // ✅ Default import now
import { User } from '../models/user.js';

const router = express.Router();
const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET;

router.post('/clerk', express.raw({ type: '*/*' }), async (req, res) => {
  const rawBody = req.body.toString('utf8');
  const signature = req.headers['clerk-signature'];

  try {
    const evt = await clerk.webhooks.verifyWebhook({
      secret: clerkWebhookSecret,
      body: rawBody,
      headers: {
        'clerk-signature': signature,
      },
    });

    console.log('✅ Clerk event verified:', evt.type);

    if (evt.type === 'user.created') {
      const email = evt.data.email_addresses?.[0]?.email_address;

      if (!email) return res.status(400).json({ error: 'No email found' });

      await connectDB(); // ✅ Using default imported function

      await User.findOneAndUpdate(
        { email },
        { email, role: 'user' },
        { upsert: true, new: true }
      );

      console.log('✅ User saved to MongoDB');
      return res.status(200).json({ message: 'User saved' });
    }

    return res.status(200).json({ message: 'Event ignored' });
  } catch (err) {
    console.error('❌ Webhook verification failed:', err);
    return res.status(400).send('Invalid signature');
  }
});

export default router;
