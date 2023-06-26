import { AnyAction } from 'redux';

import { CartItemPreview } from './cart.types';

import {
  setIsCartOpen,
  setCartItems,
  resetCartItemsState,
  updateCartItems,
} from './cart.action';

export type CartState = {
  readonly isCartOpen: boolean;
  readonly cartItems: CartItemPreview[];
};

const INITIAL_STATE: CartState = {
  isCartOpen: false,
  cartItems: [],
};

export const cartReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): CartState => {
  if (setIsCartOpen.match(action)) {
    return { ...state, isCartOpen: action.payload };
  }

  if (setCartItems.match(action)) {
    const cateState = state.cartItems;
    const newCart = action.payload;

    newCart.forEach((newCartItem) => {
      const existingCartItem = cateState.find(
        (cateState) => cateState.colorId === newCartItem.colorId
      );

      if (existingCartItem) {
        // If the item exists, increment its quantity
        existingCartItem.quantity += 1;
      } else {
        // If the item does not exist, add it to the array
        // Assuming newCartItem object has a quantity property. If not, you can add it: newCartItem.quantity = 1;
        cateState.push(newCartItem);
      }
    });
    return { ...state, cartItems: [...cateState] };
  }

  if (updateCartItems.match(action)) {
    return { ...state, cartItems: action.payload };
  }

  if (resetCartItemsState.match(action)) {
    return { isCartOpen: false, cartItems: [] };
  }

  return state;
};
