import { CART_ACTION_TYPES, CartItemPreview } from './cart.types';
import {
  createAction,
  withMatcher,
  Action,
  ActionWithPayload,
} from '../../utils/reducer/reducer.utils';

const addCartItem = (
  cartItems: CartItemPreview[],
  productToAdd: CartItemPreview
): CartItemPreview[] => {
  // find if cartItems contains productToAdd
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.colorId === productToAdd.colorId
  );

  // if found, increment quantity
  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.colorId === productToAdd.colorId
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }
  // return new array with modified cartItems/ new cartItems
  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (
  cartItems: CartItemPreview[],
  cartItemToRemove: CartItemPreview
): CartItemPreview[] => {
  // find the cart item to remove
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.colorId === cartItemToRemove.colorId
  );

  // check if quantity is equal to 1,if it is remvoe that item from cart
  if (existingCartItem && existingCartItem.quantity === 1) {
    return cartItems.filter(
      (cartItem) => cartItem.colorId !== cartItemToRemove.colorId
    );
  }

  // return back cartitems with matching cart item with reduced quantity
  return cartItems.map((cartItem) =>
    cartItem.colorId === cartItemToRemove.colorId
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

const clearCartItem = (
  cartItems: CartItemPreview[],
  cartItemToClear: CartItemPreview
): CartItemPreview[] =>
  cartItems.filter((cartItem) => cartItem.colorId !== cartItemToClear.colorId);

export type SetIsCartOpen = ActionWithPayload<
  CART_ACTION_TYPES.SET_IS_CART_OPEN,
  boolean
>;

export type SetCartItems = ActionWithPayload<
  CART_ACTION_TYPES.SET_CART_ITEMS,
  CartItemPreview[]
>;

export type UpdateCartItems = ActionWithPayload<
  CART_ACTION_TYPES.UPDATE_CART_ITEMS,
  CartItemPreview[]
>;

export type ResetCartItemsState = Action<CART_ACTION_TYPES.RESET_CART>;

export const setIsCartOpen = withMatcher(
  (boolean: boolean): SetIsCartOpen =>
    createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, boolean)
);

export const setCartItems = withMatcher(
  (cartItems: CartItemPreview[]): SetCartItems =>
    createAction(CART_ACTION_TYPES.SET_CART_ITEMS, cartItems)
);

export const updateCartItems = withMatcher(
  (cartItems: CartItemPreview[]): UpdateCartItems =>
    createAction(CART_ACTION_TYPES.UPDATE_CART_ITEMS, cartItems)
);

export const resetCartItemsState = withMatcher(
  (): ResetCartItemsState => createAction(CART_ACTION_TYPES.RESET_CART)
);

export const addItemToCart = (
  cartItems: CartItemPreview[],
  productToAdd: CartItemPreview
) => {
  const newCartItems = addCartItem(cartItems, productToAdd);
  return updateCartItems(newCartItems);
};

export const removeItemFromCart = (
  cartItems: CartItemPreview[],
  cartItemToRemove: CartItemPreview
) => {
  const newCartItems = removeCartItem(cartItems, cartItemToRemove);
  return updateCartItems(newCartItems);
};

export const clearItemFromCart = (
  cartItems: CartItemPreview[],
  cartItemToClear: CartItemPreview
) => {
  const newCartItems = clearCartItem(cartItems, cartItemToClear);
  return updateCartItems(newCartItems);
};
