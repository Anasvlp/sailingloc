import express from 'express';
import { body, validationResult } from 'express-validator';
import Stripe from 'stripe';
import { authenticateToken } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...');

// Create payment intent
router.post('/create-intent', authenticateToken, [
  body('boatId').isString(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('totalPrice').isFloat({ min: 0 }),
  body('guests').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { boatId, startDate, endDate, totalPrice, guests } = req.body;

    // Note: We assume boat exists elsewhere; omit full boat load for Mongo version

    // Create booking first
    const booking = await Booking.create({
      userId: req.user.id,
      boatId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      guestCount: guests,
      totalPrice,
      deposit: 0,
      status: 'PENDING'
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Convert to cents
      currency: 'eur',
      metadata: {
        bookingId: booking.id,
        boatId,
        userId: req.user.id
      },
      description: `Réservation ${boatId} - ${new Date(startDate).toLocaleDateString()} au ${new Date(endDate).toLocaleDateString()}`
    });

    // Create payment record
    await Payment.create({
      bookingId: booking.id,
      amount: totalPrice,
      method: 'stripe',
      status: 'pending',
      stripePaymentId: paymentIntent.id
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      bookingId: booking.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm payment
router.post('/confirm', authenticateToken, [
  body('paymentIntentId').isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const payment = await Payment.findOneAndUpdate(
        { stripePaymentId: paymentIntentId },
        { status: 'completed' },
        { new: true }
      );
      if (payment) {
        await Booking.findByIdAndUpdate(payment.bookingId, { status: 'CONFIRMED' });
      }

      res.json({ message: 'Payment confirmed successfully' });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Webhook endpoint for Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Update payment status
        await Payment.findOneAndUpdate({ stripePaymentId: paymentIntent.id }, { status: 'completed' });
        const payment = await Payment.findOne({ stripePaymentId: paymentIntent.id });
        if (payment) await Booking.findByIdAndUpdate(payment.bookingId, { status: 'CONFIRMED' });
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        
        // Update payment status
        await Payment.findOneAndUpdate({ stripePaymentId: failedPayment.id }, { status: 'failed' });
        const failedPaymentRecord = await Payment.findOne({ stripePaymentId: failedPayment.id });
        if (failedPaymentRecord) await Booking.findByIdAndUpdate(failedPaymentRecord.bookingId, { status: 'CANCELLED' });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ message: 'Webhook handler failed' });
  }
});

// Get payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;