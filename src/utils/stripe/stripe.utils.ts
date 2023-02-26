import {
  loadStripe, PaymentIntentResult, Stripe, StripeCardElement, 
} from '@stripe/stripe-js';

import { UserData } from '../firebase/firebase.utils';

// fix the any type
export type StripeFormFields = {
  card: StripeCardElement;
  currentUser: UserData | null;
  stripe: Stripe;
};

export type StripeFormFieldAmount = StripeFormFields & {
  amount: number;
};

export type StripeFormFieldCSecret = StripeFormFields & {
  client_secret:string;
};

const baseEnv = import.meta.env;
export const stripePromise = loadStripe(
  baseEnv.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY as string,
);

export const stripePaymentIntent = (amount: number): Promise<PaymentIntentResult> => {
  return new Promise((resolve) => {
    fetch('/.netlify/functions/create-payment-intent', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amount * 100 }),
    }).then((res) => {
      resolve(res.json());
    });
  }) as Promise<PaymentIntentResult>;
};

export const stripePaymentConfirm = (card:StripeCardElement, currentUser:UserData | null, stripe:Stripe, client_secret: string): Promise<PaymentIntentResult> => {
  return new Promise((resolve) => {
    stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card,
        billing_details: {
          name: currentUser ? currentUser.displayName : 'Guest',
        },
      },
    }).then((res) => {
      resolve(res);
    });
  }) as Promise<PaymentIntentResult>;
};

/* 
export const stripePaymentIntent = async ({amount}) => {
    
    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: amount * 100 }),
    }).then(res => {return res.json()});
  
    console.log('response result:',response);
      
    const {paymentIntent: { client_secret }} = response;

    const paymentResult = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: card,
        billing_details: {
          name: currentUser ? currentUser.displayName : 'Guest',
        }
      }
    });
    console.log('payment result:',paymentResult);

    if(paymentResult.error){
      return paymentResult.error;
    }
    else if(paymentResult.paymentIntent.status === 'succeeded'){
      return paymentResult.paymentIntent;
    }
}; */
