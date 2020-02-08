import axios from 'axios';
import { showAlert } from './alerts';

const bookTourBtn = document.getElementById('book-tour');
if (bookTourBtn) {
  var stripe = Stripe('pk_test_ItNCR4UoBEMTqeMEaHtdmRim00Vyx1he2t');
}

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form and charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
