/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51NuECTSEwqRC9OPWI6jDq6bODtxRNf4vNH4vTkArbjkLG60Utj5vqZVyrbQaDR2AlTjP5QBI5unmLUIJDme3Ssux00iG2U9VSI',
);

export const bookTour = async (tourId) => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
