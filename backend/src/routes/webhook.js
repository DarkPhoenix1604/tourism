import express from 'express';
import { Webhook } from 'svix';
import connectDB from '../lib/db.js';
import { User } from '../models/user.js';

const router = express.Router();

router.post('/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!clerkWebhookSecret) {
      throw new Error('CLERK_WEBHOOK_SECRET is not set in environment variables.');
    }

    // Get the Svix headers for verification
    const svix_id = req.headers['svix-id'];
    const svix_timestamp = req.headers['svix-timestamp'];
    const svix_signature = req.headers['svix-signature'];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).send('Error: Missing Svix headers');
    }

    // Get the raw body from the request
    const body = req.body;

    // Create a new Svix instance with your secret
    const wh = new Webhook(clerkWebhookSecret);

    let evt;
    try {
      // Verify the webhook payload
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('❌ Error verifying webhook:', err.message);
      return res.status(400).send('Error: Invalid webhook signature');
    }

    // Handle the event
    if (evt.type === 'user.created') {
      const email = evt.data.email_addresses?.[0]?.email_address;
      const fullName = `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim();

      if (!email) {
        return res.status(400).json({ error: 'Missing email in webhook data' });
      }

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

      console.log(`✅ User created/updated: ${email}`);
    }

    res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (err) {
    console.error('❌ Webhook handler failed:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

export default router;