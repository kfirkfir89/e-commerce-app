import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PaymentIntentResult, Stripe } from '@stripe/stripe-js';
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
    const getClientSecret = async () => {
      try {
        const res = await stripePaymentIntent(10000);
        if (res && res.paymentIntent) {
          setClientSecret(res.paymentIntent.client_secret as string);
        }
      } catch (error) {
        console.log('error:', error);
      }
    };
    const res = getClientSecret();
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

  const clearItemHandler = (item: CartItemPreview) =>
    dispatch(clearItemFromCart(cartItems, item));
  return (
    <div className="flex h-full w-full justify-center bg-white">
      <div className="container">
        <div className="grid h-full w-full justify-items-center md:grid-cols-6">
          <div className="order-2 flex h-full w-full flex-col md:order-1 md:col-span-4">
            {stripePromiseState && clientSecret && (
              <Elements stripe={stripePromiseState!} options={{ clientSecret }}>
                <PaymentForm />
              </Elements>
            )}
          </div>
          <div className="md:order-1 md:col-span-2">
            <div className="flex h-full max-w-md flex-col items-center justify-start overflow-y-auto bg-white p-2">
              {cartItems.map((cartItem) => (
                <CheckoutItem key={cartItem.colorId} cartItem={cartItem} />
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
