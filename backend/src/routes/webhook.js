import express from 'express';
import crypto from 'crypto';
import connectDB from '../lib/db.js';
import { User } from '../models/user.js';

const router = express.Router();
const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET;

function verifySignature(rawBody, signature, secret) {
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'utf8'),
    Buffer.from(expectedSig, 'utf8')
  );
}

router.post('/clerk', express.raw({ type: '*/*' }), async (req, res) => {
  const rawBody = req.body.toString('utf8');
  const signature = req.headers['clerk-signature'];

  try {
    if (!verifySignature(rawBody, signature, clerkWebhookSecret)) {
      throw new Error('Invalid signature');
    }

    const evt = JSON.parse(rawBody);
    console.log('✅ Clerk event verified:', evt.type);

    if (evt.type === 'user.created') {
      const email = evt.data.email_addresses?.[0]?.email_address;
      const fullName = `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim();

      if (!email) return res.status(400).json({ error: 'Missing email' });

      await connectDB();

      await User.findOneAndUpdate(
        { email },
        {
          email,
          name: fullName,
          role: 'user',
          image: evt.data.image_url,
        },
        { upsert: true, new: true }
      );

      console.log('✅ User saved:', email);
      return res.status(200).json({ message: 'User saved' });
    }

    return res.status(200).json({ message: 'Event ignored' });
  } catch (err) {
    console.error('❌ Webhook failed:', err.message);
    return res.status(400).send('Invalid webhook');
  }
});

export default router;
