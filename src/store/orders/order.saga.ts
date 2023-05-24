import { all, call, takeLatest, put, select } from 'typed-redux-saga';

import { CreateOrderStart, orderSuccesded, orderFailed } from './order.action';
import { resetCartItemsState } from '../cart/cart.action';

import { ORDER_ACTION_TYPES, NewOrderDetails } from './order.types';

// eslint-disable-next-line import/no-cycle
import * as cartSelectors from '../cart/cart.selector';

import {
  stripePaymentIntent,
  stripePaymentConfirm,
  StripeFormFieldCSecret,
} from '../../utils/stripe/stripe.utils';
import { createNewOrderDocument } from '../../utils/firebase/firebase.utils';

export function* getCartItemsSAGA() {
  const cartItems = yield* select(cartSelectors.selectCartItems);
  return cartItems;
}

export function* resetCartItems() {
  yield* put(resetCartItemsState());
}

export function* confirmStripePayment({
  card,
  currentUser,
  stripe,
  client_secret,
}: StripeFormFieldCSecret) {
  const { paymentIntent, error } = yield* call(
    stripePaymentConfirm,
    card,
    currentUser,
    stripe,
    client_secret
  );

  if (paymentIntent !== undefined && paymentIntent.status === 'succeeded') {
    const date = new Date();
    const orderItems = yield* call(getCartItemsSAGA);
    const newOrderDetails: NewOrderDetails = {
      orderId: paymentIntent.created,
      createDate: date,
      user: currentUser,
      orderItems,
      paymentIntent,
    };

    yield* call(createNewOrderDocument, newOrderDetails);
    yield* put(orderSuccesded(newOrderDetails));
  } else {
    alert(error?.message);
    yield* put(orderFailed(error as any));
  }
}

export function* paymentIntentInit({
  payload: { amount, card, currentUser, stripe },
}: CreateOrderStart) {
  const { paymentIntent, error } = yield* call(stripePaymentIntent, amount);
  if (paymentIntent !== undefined && paymentIntent.client_secret !== null) {
    const { client_secret } = paymentIntent;
    yield* call(confirmStripePayment, {
      card,
      currentUser,
      stripe,
      client_secret,
    });
  } else {
    alert(error?.message);
    yield* put(orderFailed(error as any));
  }
}

export function* onNewOrderSuccess() {
  yield* takeLatest(ORDER_ACTION_TYPES.FETCH_ORDER_SUCCESS, resetCartItems);
}

export function* onCreateOrderStart() {
  yield* takeLatest(ORDER_ACTION_TYPES.FETCH_ORDER_START, paymentIntentInit);
}

export function* orderSaga() {
  yield* all([call(onCreateOrderStart), call(onNewOrderSuccess)]);
}
