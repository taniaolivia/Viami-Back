const functions = require("firebase-functions");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Charge user to subscribe to Viami premium plan
exports.payPremium = async (req, res) => {
  const amount = req.body.amount;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'EUR',
      payment_method_types: ['card'],
    });

    res.status(200).json({ 
        paymentIntent: paymentIntent.client_secret, 
        paymentIntentData: paymentIntent,
        amount: req.body.amount,
        currency: "EUR"
    });
  } catch (err) {
    console.error('Error processing payment:', err);
    let message = 'An error occurred while processing your payment.';

    if (err.type === 'StripeCardError') {
      message = err.message;
    }

    res.status(500).send(message);
  }
}