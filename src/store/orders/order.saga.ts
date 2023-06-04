import { all, call, takeLatest, put, select } from 'typed-redux-saga';

import { resetCartItemsState } from '../cart/cart.action';

import { ORDER_ACTION_TYPES, NewOrderDetails } from './order.types';

// eslint-disable-next-line import/no-cycle
import * as cartSelectors from '../cart/cart.selector';
import { OrderSuccesded, orderSuccesded } from './order.action';
import { createNewOrderDocument } from '../../utils/firebase/firebase.utils';

// old saga for stripe with clegacy card
// export function* confirmStripePayment({
//   card,
//   currentUser,
//   stripe,
//   client_secret,
// }: StripeFormFieldCSecret) {
//   const { paymentIntent, error } = yield* call(
//     stripePaymentConfirm,
//     card,
//     currentUser,
//     stripe,
//     client_secret
//   );

//   if (paymentIntent !== undefined && paymentIntent.status === 'succeeded') {
//     const date = new Date();
//     const orderItems = yield* call(getCartItemsSAGA);
//     const newOrderDetails: NewOrderDetails = {
//       orderId: paymentIntent.created,
//       createDate: date,
//       user: currentUser,
//       orderItems,
//       paymentIntent,
//     };

//     yield* call(createNewOrderDocument, newOrderDetails);
//     yield* put(orderSuccesded(newOrderDetails));
//   } else {
//     alert(error?.message);
//     yield* put(orderFailed(error as any));
//   }
// }

// export function* paymentIntentInit({
//   payload: { amount, element, currentUser, stripe },
// }: CreateOrderStart) {
//   const { paymentIntent, error } = yield* call(stripePaymentIntent, amount);
//   if (paymentIntent !== undefined && paymentIntent.client_secret !== null) {
//     const { client_secret } = paymentIntent;
//     yield* call(confirmStripePayment, {
//       element,
//       currentUser,
//       stripe,
//       client_secret,
//     });
//   } else {
//     alert(error?.message);
//     yield* put(orderFailed(error as any));
//   }
// }

// eslint-disable-next-line require-yield

// eslint-disable-next-line require-yield
export function* addNewOrder({ payload: newOrder }: OrderSuccesded) {
  try {
    yield* call(createNewOrderDocument, newOrder);

    yield* put(orderSuccesded(newOrder)); 
    
  } catch (error) {
    console.log('error:', error);
  }
}

export function* getCartItemsSAGA() {
  const cartItems = yield* select(cartSelectors.selectCartItems);
  return cartItems;
}

export function* resetCartItems() {
  yield* put(resetCartItemsState());
}

export function* onNewOrderSuccess() {
  yield* takeLatest(ORDER_ACTION_TYPES.FETCH_ORDER_SUCCESS, addNewOrder);
}

export function* orderSaga() {
  yield* all([call(onNewOrderSuccess)]);
}
