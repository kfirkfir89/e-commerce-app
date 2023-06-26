import { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectCartItems } from '../../store/cart/cart.selector';
import {
  addItemToCart,
  clearItemFromCart,
  removeItemFromCart,
} from '../../store/cart/cart.action';

import { CartItemPreview } from '../../store/cart/cart.types';

import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';

type CheckoutItemsProps = {
  cartItem: CartItemPreview;
};

const CheckoutItem: FC<CheckoutItemsProps> = ({ cartItem }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const clearItemHandler = () =>
    dispatch(clearItemFromCart(cartItems, cartItem));
  const addItemHandler = () => dispatch(addItemToCart(cartItems, cartItem));
  const removeItemHandler = () =>
    dispatch(removeItemFromCart(cartItems, cartItem));

  return (
    <div
      key={cartItem.colorId}
      className="flex w-full space-x-2 border-b-2 bg-white p-2 font-dosis uppercase tracking-wide text-slate-700"
    >
      <img
        src={`${cartItem.previewImage}`}
        alt={`${cartItem.productName}`}
        className="h-full w-1/3 flex-shrink-0 rounded object-cover outline-none"
      />
      <div className="flex h-full w-full flex-col gap-y-2 px-1 capitalize">
        <div className="flex h-full w-full text-base">
          <div className="flex flex-1 flex-col gap-y-1 font-semibold">
            <h3>{cartItem.productName}</h3>
            <p>$ {cartItem.price}</p>
            <div className="grid grid-cols-4 text-sm font-normal">
              <div className="col-span-1 flex flex-col">
                <span>Color:</span>
                <span>Size:</span>
              </div>
              <div className="col-span-3 flex flex-col">
                <span>{cartItem.color}</span>
                <span>{cartItem.size}</span>
              </div>
            </div>
            <div className="flex w-full items-center ">
              <div className="flex flex-1">
                <span className="pr-2 font-semibold leading-5">Quantity:</span>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={removeItemHandler}
                    className="flex cursor-pointer"
                  >
                    &#10094;
                  </button>
                  <span>{cartItem.quantity}</span>
                  <button
                    onClick={addItemHandler}
                    className="flex cursor-pointer"
                  >
                    &#10095;
                  </button>
                </div>
              </div>
              <div className="flex">
                <button
                  onClick={clearItemHandler}
                  type="button"
                  className="flex w-7"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutItem;
