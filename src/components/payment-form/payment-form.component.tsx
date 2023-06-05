import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { v4 } from 'uuid';

import { StripeError } from '@stripe/stripe-js';
import { Timestamp } from 'firebase/firestore';
import { NewOrderDetails } from '../../store/orders/order.types';

import { selectCurrentUser } from '../../store/user/user.selector';
import { selectCartItems } from '../../store/cart/cart.selector';
import { selectOrderDetails } from '../../store/orders/order.selector';

import { createOrderStart } from '../../store/orders/order.action';
import { updateUserOrders } from '../../store/user/user.action';
import { UserAddress } from '../../utils/firebase/firebase.user.utils';

export enum PAYMENT_STATUS {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
}

const PaymentForm = ({
  deliveryAddress,
  isExpressDelivery,
}: {
  deliveryAddress: UserAddress;
  isExpressDelivery: boolean;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUserSelector = useSelector(selectCurrentUser);
  const cartItemsSelector = useSelector(selectCartItems);
  const orderDetails = useSelector(selectOrderDetails);

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (orderDetails !== null) {
      return navigate('/payment-succeeded');
    }
    if (cartItemsSelector.length === 0) {
      return navigate('/cart');
    }
  }, [orderDetails, cartItemsSelector, navigate]);

  const paymentHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements || !currentUserSelector) {
      return;
    }

    setIsProcessing(true);

    try {
      const { paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: 'http://localhost:8888/',
        },
        redirect: 'if_required',
      });

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('payment succeeded');

        const newOrder: NewOrderDetails = {
          orderId: `${
            currentUserSelector.firstName + currentUserSelector.lastName + v4()
          }`,
          createDate: Timestamp.fromDate(new Date()),
          user: currentUserSelector,
          orderItems: cartItemsSelector,
          paymentIntent,
          deliveryAddress,
          isExpressDelivery,
          trackingNumber: '',
          orderStatus: PAYMENT_STATUS.PENDING,
        };
        dispatch(createOrderStart(newOrder));
        dispatch(updateUserOrders(newOrder.orderId));
      }
    } catch (error) {
      const stripeError = error as StripeError;
      stripeError.message && setMessage(stripeError.message);
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
      </form>
    </div>
  );
};

export default PaymentForm;
