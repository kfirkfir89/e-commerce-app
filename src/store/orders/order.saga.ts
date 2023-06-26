import { all, call, takeLatest, put, select } from 'typed-redux-saga';

import { resetCartItemsState } from '../cart/cart.action';

import { ORDER_ACTION_TYPES } from './order.types';

// eslint-disable-next-line import/no-cycle
import * as cartSelectors from '../cart/cart.selector';
import { OrderSuccesded, orderSuccesded } from './order.action';
import { createNewOrderDocument } from '../../utils/firebase/firebase.order.utils';

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
  yield* takeLatest(ORDER_ACTION_TYPES.FETCH_ORDER_START, addNewOrder);
}

export function* orderSaga() {
  yield* all([call(onNewOrderSuccess)]);
}
