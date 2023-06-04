import { PaymentIntent } from '@stripe/stripe-js';
import { UserData } from '../../utils/firebase/firebase.utils';

import { CartItemPreview } from '../cart/cart.types';
import { Timestamp } from 'firebase/firestore';

export enum ORDER_ACTION_TYPES {
  FETCH_ORDER_START = 'order/FETCH_ORDER_START',
  FETCH_ORDER_SUCCESS = 'order/FETCH_ORDER_SUCCESS',
  FETCH_ORDER_FAILED = 'order/FETCH_ORDER_FAILED',
  RESET_STATE = 'order/RESET_STATE',
}


export type NewOrderDetails = {
  orderId: string;
  createDate: Timestamp;
  user: UserData;
  orderItems: CartItemPreview[];
  paymentIntent: PaymentIntent;
  orderStatus: string;
};
