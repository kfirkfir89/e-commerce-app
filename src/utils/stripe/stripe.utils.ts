/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  loadStripe,
  PaymentIntentResult,
  Stripe,
  StripeElement,
} from '@stripe/stripe-js';

import { UserData } from '../firebase/firebase.utils';

// fix the any type
export type StripeFormFields = {
  element: StripeElement;
  currentUser: UserData | null;
  stripe: Stripe;
};

export type StripeFormFieldAmount = StripeFormFields & {
  amount: number;
};

export type StripeFormFieldCSecret = StripeFormFields & {
  client_secret: string;
};

const baseEnv = import.meta.env;
export const stripePromise = loadStripe(
  baseEnv.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY as string
);

export const stripePaymentIntent = async (
  amount: number
): Promise<PaymentIntentResult | undefined> => {
  console.log('amount:', amount)
  try {
    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amount * 100 }),
    });
    console.log('response:', response);
    if (response.ok) {
      const res: PaymentIntentResult = await response.json();
      return res;
    }
    console.error('Error: ', response.status, response.statusText);
  } catch (error) {
    console.log('error:', error);
  }
};

// export const stripePaymentConfirm = async (
//   amount: number
// ): Promise<PaymentIntentResult | undefined> => {
//   try {
//     const response = await fetch('/.netlify/functions/create-payment-intent', {
//       method: 'post',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ amount: amount * 100 }),
//     });
//     console.log('response:', response);
//     if (response.ok) {
//       const res: PaymentIntentResult = await response.json();
//       return res;
//     }
//     console.error('Error: ', response.status, response.statusText);
//   } catch (error) {
//     console.log('error:', error);
//   }
// };

// cart option (old way to do it)
// export const stripePaymentIntent = (
//   amount: number
// ): Promise<PaymentIntentResult> => {
//   return new Promise((resolve) => {
//     fetch('/.netlify/functions/create-payment-intent', {
//       method: 'post',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ amount: amount * 100 }),
//     }).then((res) => {
//       resolve(res.json());
//     });
//   }) as Promise<PaymentIntentResult>;
// };

// export const stripePaymentConfirm = (
//   card: StripeCardElement,
//   currentUser: UserData | null,
//   stripe: Stripe,
//   client_secret: string
// ): Promise<PaymentIntentResult> => {
//   return new Promise((resolve) => {
//     stripe
//       .confirmCardPayment(client_secret, {
//         payment_method: {
//           card,
//           billing_details: {
//             name: currentUser ? currentUser.displayName : 'Guest',
//           },
//         },
//       })
//       .then((res) => {
//         resolve(res);
//       });
//   }) as Promise<PaymentIntentResult>;
// };
