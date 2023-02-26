import { CategoryItem } from '../categories/category.types';

export enum CART_ACTION_TYPES {
  SET_CART_ITEMS = 'cart/SET_CART_ITEMS',
  SET_IS_CART_OPEN = 'cart/SET_IS_CART_OPEN',
  SET_CART_COUNT = 'cart/SET_CART_COUNT',
  SET_CART_TOTAL = 'cart/SET_CART_TOTAL',
  RESET_CART = 'cart/RESET_CART',
}

export type CartItemQuantity = CategoryItem & {
  quantity: number;
};
