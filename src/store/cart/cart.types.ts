export enum CART_ACTION_TYPES {
  SET_CART_ITEMS = 'cart/SET_CART_ITEMS',
  UPDATE_CART_ITEMS = 'cart/UPDATE_CART_ITEMS',
  SET_IS_CART_OPEN = 'cart/SET_IS_CART_OPEN',
  SET_CART_COUNT = 'cart/SET_CART_COUNT',
  SET_CART_TOTAL = 'cart/SET_CART_TOTAL',
  RESET_CART = 'cart/RESET_CART',
}

export type CartItemPreview = {
  id: string;
  colorId: string;
  productName: string;
  price: number;
  color: string;
  size: string;
  previewImage: string;
  quantity: number;
};
