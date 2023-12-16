const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Charge user to subscribe to Viami premium plan
exports.payPremium = async (req, res) => {
  const { amount, token } = req.body;

  try {
    await stripe.charges.create({
      amount,
      currency: 'euro',
      source: token.id,
      description: 'Charge for test@example.com',
    });

    res.send('Payment successful');
  } catch (err) {
    console.error('Error processing payment:', err);
    let message = 'An error occurred while processing your payment.';

    if (err.type === 'StripeCardError') {
      message = err.message;
    }

    res.status(500).send(message);
  }
}