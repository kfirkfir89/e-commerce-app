import { PaymentIntent } from '@stripe/stripe-js';
import { Timestamp } from 'firebase/firestore';

import { CartItemPreview } from '../cart/cart.types';
import {
  UserAddress,
  UserData,
} from '../../utils/firebase/firebase.user.utils';

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
  deliveryAddress: UserAddress;
  isExpressDelivery: boolean;
  orderStatus: string;
  trackingNumber: string;
};
