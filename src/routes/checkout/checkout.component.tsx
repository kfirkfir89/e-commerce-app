import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Appearance, PaymentIntentResult, Stripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import {
  selectCartItems,
  selectCartTotal,
} from '../../store/cart/cart.selector';

import CheckoutItem from '../../components/checkout-item/checkout-item.component';

import PaymentForm from '../../components/payment-form/payment-form.component';
import {
  selectCurrentUser,
  selectUserIsLoading,
} from '../../store/user/user.selector';
import { getCurrentUser } from '../../utils/firebase/firebase.utils';

import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import { CartItemPreview } from '../../store/cart/cart.types';
import { clearItemFromCart } from '../../store/cart/cart.action';
import {
  stripePaymentIntent,
  stripePromise,
} from '../../utils/stripe/stripe.utils';

const appearance: Appearance = {
  theme: 'flat',
  variables: {
    fontFamily: ' "Gill Sans", sans-serif',
    fontLineHeight: '1.5',
    borderRadius: '10px',
    colorBackground: '#F6F8FA',
    colorPrimaryText: '#262626',
  },
  rules: {
    '.Block': {
      backgroundColor: 'var(--colorBackground)',
      boxShadow: 'none',
      padding: '12px',
    },
    '.Input': {
      padding: '12px',
    },
    '.Input:disabled, .Input--invalid:disabled': {
      color: 'lightgray',
    },
    '.Tab': {
      padding: '10px 12px 8px 12px',
      border: 'none',
    },
    '.Tab:hover': {
      border: 'none',
      boxShadow:
        '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
    },
    '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
      border: 'none',
      backgroundColor: '#fff',
      boxShadow:
        '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
    },
    '.Label': {
      fontWeight: '500',
    },
  },
};
const CheckOut = () => {
  const currentUserSelector = useSelector(selectCurrentUser);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const [stripePromiseState, setStripePromiseState] = useState<Stripe | null>();
  const [clientSecret, setClientSecret] = useState<string>();
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getStripe = async () => {
      try {
        const stripe = await stripePromise;
        setStripePromiseState(stripe);
      } catch (error) {
        console.log('error:', error);
      }
    };
    const res = getStripe();
  }, []);

  useEffect(() => {
    const getClientSecret = async (amount: number) => {
      try {
        const res = await stripePaymentIntent(amount);
        if (res && res.paymentIntent) {
          setClientSecret(res.paymentIntent.client_secret as string);
        }
      } catch (error) {
        console.log('error:', error);
      }
    };
    if (cartTotal) {
      const amount: number = cartTotal;
      const res = getClientSecret(amount);
    }
  }, [cartTotal]);

  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setIsEmailVerified(user.emailVerified);
        }
      } catch (error) {
        console.log('error:', error);
      }
    };
    if (currentUserSelector === null) {
      navigate('/authentication');
    }
    const getUserVerification = getAuthUser();
  }, [currentUserSelector, navigate]);

  return (
    <div className="flex h-full w-full justify-center bg-white">
      <div className="container">
        <div className="grid h-full w-full justify-items-center gap-3 px-2 md:grid-cols-6">
          {/* payment page */}
          <div className="order-2 flex h-full w-full flex-col pt-[6px] md:order-1 md:col-span-4">
            {stripePromiseState && clientSecret && (
              <Elements
                stripe={stripePromiseState!}
                options={{ clientSecret, appearance }}
              >
                <PaymentForm />
              </Elements>
            )}
          </div>
          {/* side cart  */}
          <div className="h-full w-full md:order-1 md:col-span-2">
            <div className="flex h-full w-full max-w-md flex-col items-center justify-start overflow-y-auto bg-white">
              {cartItems.map((cartItem) => (
                <div
                  key={cartItem.colorId}
                  className="flex w-full space-x-2 border-b-2 bg-white font-dosis uppercase tracking-wide text-slate-700"
                >
                  <img
                    src={`${cartItem.previewImage}`}
                    alt={`${cartItem.productName}`}
                    className="h-full w-1/3 flex-shrink-0 rounded object-cover outline-none"
                  />
                  <div className="flex h-full w-full flex-col gap-y-2 px-1 capitalize">
                    <div className="flex flex-1 flex-col gap-y-1 text-base font-semibold">
                      <h3>{cartItem.productName}</h3>
                      <p>$ {cartItem.price}</p>
                      <div className="grid grid-cols-2 text-sm font-normal">
                        <div className="flex flex-col">
                          <span>Color:</span>
                          <span>Size:</span>
                          <span>Quantity:</span>
                        </div>
                        <div className="flex flex-col">
                          <span>{cartItem.color}</span>
                          <span>{cartItem.size}</span>
                          <span>{cartItem.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="leading-0 my-8 bg-white font-dosis text-sm uppercase tracking-wide text-slate-700">
                <span className="flex text-lg  font-semibold">
                  <span className="flex-1">Total amount: </span>
                  <span className="flex-none">${cartTotal}</span>
                </span>
                <p className="text-sm text-gray-400">
                  Not including taxes and shipping costs
                </p>
              </div>
              {/* <span className="mt-7 ml-auto text-3xl">Total: ${cartTotal}</span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
