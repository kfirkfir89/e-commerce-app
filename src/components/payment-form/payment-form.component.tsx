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
import { selectCartItems, selectCartTotal } from '../../store/cart/cart.selector';
import {
  selectIsLoadingOrder,
  selectOrderDetails,
} from '../../store/orders/order.selector';

import { createOrderStart, orderSuccesded } from '../../store/orders/order.action';
import { NewOrderDetails } from '../../store/orders/order.types';
import { v4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';

export enum PAYMENT_STATUS {
  PENDING = "Pending",
  PROCESSING = "Processing",
  COMPLETED = "Completed",
  FAILED = "Failed",
  CANCELLED = "Cancelled"
}
const ifValidPaymentElement = (
  element: StripeElement | null
): element is StripeElement => element !== null;

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const amount = useSelector(selectCartTotal);
  const currentUserSelector = useSelector(selectCurrentUser);
  const cartItemsSelector = useSelector(selectCartItems);
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

    if (!stripe || !elements || !currentUserSelector) {
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

      const newOrder : NewOrderDetails = {
        orderId: `${currentUserSelector.firstName + currentUserSelector.lastName + v4()}`,
        createDate: Timestamp.fromDate(new Date()),
        user: currentUserSelector,
        orderItems: cartItemsSelector,
        paymentIntent: paymentIntent,
        orderStatus: PAYMENT_STATUS.PENDING,

      };
      dispatch(orderSuccesded(newOrder));
    }
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-2xl px-4">
      <form
        className="container flex flex-col  gap-2 bg-gray-100 p-2"
        onSubmit={paymentHandler}
      >
        <PaymentElement />
        <div className="flex justify-center ">
          <button
            className={`${
              isProcessing ? 'loading' : ''
            }  btn mt-4 w-full max-w-md rounded-none shadow-sm`}
          >
            <div className="flex w-full items-center justify-center ">
              <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                Pay now
              </span>
            </div>
          </button>
        </div>
        <span className="text-lg font-semibold text-slate-500">{message}</span>
        {shouldRedirect && <Navigate to="/payment-succeeded" />}
      </form>
    </div>
  );
};

export default PaymentForm;
