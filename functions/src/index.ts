import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const stripe = require('stripe')(functions.config().stripe.secret);

admin.initializeApp();

export const createPaymentIntent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  const { amount, currency = 'inr' } = data;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId: context.auth.uid },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
