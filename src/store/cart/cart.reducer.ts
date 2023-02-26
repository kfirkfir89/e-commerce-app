import { AnyAction } from 'redux';

import { CartItemQuantity } from './cart.types';

import { setIsCartOpen, setCartItems, resetCartItemsState } from './cart.action';

export type CartState = {
  readonly isCartOpen: boolean;
  readonly cartItems: CartItemQuantity[],
};

const INITIAL_STATE: CartState = {
  isCartOpen: false,
  cartItems: [],
};

export const cartReducer = (
  state = INITIAL_STATE,
  action: AnyAction,
): CartState => {
  if (setIsCartOpen.match(action)) {
    return { ...state, isCartOpen: action.payload };
  }

  if (setCartItems.match(action)) {
    return { ...state, cartItems: action.payload };
  }
  
  if (resetCartItemsState.match(action)) {
    return { isCartOpen: false, cartItems: [] };
  }

  return state;
};
