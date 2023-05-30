import { FormEvent, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  CardElement,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import {
  StripeCardElement,
  Appearance,
  StripeCardElementOptions,
  StripePaymentElement,
  StripeElement,
} from '@stripe/stripe-js';

import { selectCurrentUser } from '../../store/user/user.selector';
import { selectCartTotal } from '../../store/cart/cart.selector';
import {
  selectIsLoadingOrder,
  selectOrderDetails,
} from '../../store/orders/order.selector';

import { createOrderStart } from '../../store/orders/order.action';

const ifValidPaymentElement = (
  element: StripeElement | null
): element is StripeElement => element !== null;

// const element: StripeCardElementOptions = {
//   iconStyle: 'solid',
//   style: {
//     base: {
//       iconColor: '#c4f0ff',
//       color: '#ff0',
//       fontWeight: '500',
//       fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
//       fontSize: '16px',
//       fontSmoothing: 'antialiased',

//       ':-webkit-autofill': {
//         color: '#fce883',
//       },
//       '::placeholder': {
//         color: '#87BBFD',
//       },
//     },
//     invalid: {
//       iconColor: '#FFC7EE',
//       color: '#FFC7EE',
//     },
//   },
// };
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const amount = useSelector(selectCartTotal);
  const currentUser = useSelector(selectCurrentUser);
  const orderIsLoading = useSelector(selectIsLoadingOrder);
  const orderDetails = useSelector(selectOrderDetails);

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const shouldRedirect = useMemo(() => {
    if (orderDetails !== null) {
      return true;
    }
    return false;
  }, [orderDetails]);

  const paymentHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const paymentElement = elements.getElement(PaymentElement);
    if (!ifValidPaymentElement(paymentElement)) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:8888/',
      },
      redirect: 'if_required',
    });

    if (error && error.message) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('weeeeee payment succeedede');
    }
    setIsProcessing(false);
    // dispatch(createOrderStart(amount, paymentElement, currentUser, stripe));
  };

  return (
    <div className="flex h-80 flex-col items-center justify-center">
      <form
        className="container flex flex-col bg-gray-100"
        onSubmit={paymentHandler}
      >
        <h2>Credit Card Payment</h2>
        <PaymentElement />
        <button className={`btn-accent btn ${isProcessing ? 'loading' : ''}`}>
          Pay Now
        </button>
        <span className="text-lg font-semibold text-slate-500">{message}</span>
        {shouldRedirect && <Navigate to="/payment-succeeded" />}
      </form>
    </div>
  );
};

export default PaymentForm;
