import { Stripe, StripeElement } from '@stripe/stripe-js';
import {
  createAction,
  withMatcher,
  Action,
  ActionWithPayload,
} from '../../utils/reducer/reducer.utils';

import { StripeFormFieldAmount } from '../../utils/stripe/stripe.utils';
import { ORDER_ACTION_TYPES, NewOrderDetails } from './order.types';
import { UserData } from '../../utils/firebase/firebase.utils';

export type CreateOrderStart = ActionWithPayload<
  ORDER_ACTION_TYPES.FETCH_ORDER_START,
  StripeFormFieldAmount
>;
export type OrderSuccesded = ActionWithPayload<
  ORDER_ACTION_TYPES.FETCH_ORDER_SUCCESS,
  NewOrderDetails
>;
export type OrderFailed = ActionWithPayload<
  ORDER_ACTION_TYPES.FETCH_ORDER_FAILED,
  Error
>;
export type ResetOrderState = Action<ORDER_ACTION_TYPES.RESET_STATE>;

export const orderSuccesded = withMatcher(
  (newOrderDetails: NewOrderDetails): OrderSuccesded =>
    createAction(ORDER_ACTION_TYPES.FETCH_ORDER_SUCCESS, newOrderDetails)
);

export const orderFailed = withMatcher(
  (error: Error): OrderFailed =>
    createAction(ORDER_ACTION_TYPES.FETCH_ORDER_FAILED, error)
);

export const resetOrderState = withMatcher(
  (): ResetOrderState => createAction(ORDER_ACTION_TYPES.RESET_STATE)
);

export const createOrderStart = withMatcher(
  (
    amount: number,
    element: StripeElement,
    currentUser: UserData | null,
    stripe: Stripe
  ): CreateOrderStart =>
    createAction(ORDER_ACTION_TYPES.FETCH_ORDER_START, {
      amount,
      element,
      currentUser,
      stripe,
    })
);
