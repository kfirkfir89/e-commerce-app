import { AnyAction } from 'redux';

import {
  createOrderStart, orderSuccesded, orderFailed, resetOrderState, 
} from './order.action';
import { NewOrderDetails } from './order.types';

export type OrderState = {
  readonly isLoading: boolean;
  readonly orderDetails: NewOrderDetails | null;
  readonly error: Error | null;
};

export const ORDERS_INITIAL_STATE: OrderState = {
  isLoading: false,
  orderDetails: null,
  error: null,
};

export const orderReducer = (state = ORDERS_INITIAL_STATE, action: AnyAction) => {
  if (createOrderStart.match(action)) {
    return { ...state, isLoading: true };
  }

  if (orderSuccesded.match(action)) {
    return { ...state, isLoading: false, orderDetails: action.payload };
  }
  
  if (orderFailed.match(action)) {
    return { ...state, isLoading: false, error: action.payload };
  }
  
  if (resetOrderState.match(action)) {
    return { ...state, isLoading: false, orderDetails: null };
  }

  return state;
};
