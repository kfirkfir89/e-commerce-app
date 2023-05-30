/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import {
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  selectIsCartOpen,
} from '../../store/cart/cart.selector';
import { ReactComponent as ShoppingIcon } from '../../assets/local_mall.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';

import { clearItemFromCart, setIsCartOpen } from '../../store/cart/cart.action';
import { resetOrderState } from '../../store/orders/order.action';
import { CartItemPreview } from '../../store/cart/cart.types';

const CartDropdown = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isIconHover, setIsIconHover] = useState(false);
  const [isHover, setIsHover] = useState(false);

  // reset the previous order details if exsist before go to checkout
  const goToCheckOutHandler = useCallback(() => {
    setIsIconHover(false);
    dispatch(resetOrderState());
    navigate('/checkout');
  }, []);

  // cartdropdown open and close hover
  useEffect(() => {
    if (isHover) {
      setIsIconHover(true);
    } else {
      const timeout = setTimeout(() => {
        setIsIconHover(false);
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [isHover]);

  // remove item from cart
  const clearItemHandler = (item: CartItemPreview) =>
    dispatch(clearItemFromCart(cartItems, item));

  return (
    <div className="relative z-[100]">
      <button
        className="relative flex flex-col items-center justify-center"
        onClick={() => setIsIconHover(!isIconHover)}
        onMouseEnter={() => setIsIconHover(true)}
        onMouseLeave={() => setIsIconHover(false)}
      >
        <ShoppingIcon className="mb-1 w-9" />
        <span className="absolute pt-1 text-[10px] font-bold opacity-70 sm:text-xs">
          {cartCount}
        </span>
        <div
          className={`absolute bottom-0 w-4 border-8 border-dashed border-transparent border-b-slate-300 opacity-0 transition-all duration-200 ease-in-out ${
            isIconHover ? 'opacity-100' : ''
          }`}
        ></div>
      </button>

      <div
        className={`absolute right-1 grid w-72 grid-rows-[0fr] overflow-hidden transition-all duration-500 ease-in-out sm:w-96 ${
          isIconHover
            ? 'grid-rows-[1fr] border border-b-0 border-slate-300 shadow-md'
            : ''
        }`}
      >
        <div
          className="min-h-0"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div className="leading-0 flex max-w-3xl flex-col bg-slate-300 p-2 font-dosis text-xs font-normal uppercase tracking-wide text-slate-700">
            <h2>
              My Bag,{' '}
              <span className="pl-1 text-base font-semibold capitalize">
                {cartCount} items
              </span>
            </h2>
          </div>
          <div className="bg-gray-100 py-4">
            <div className="card w-full">
              <div className="scrollbarStyle flex max-h-96 flex-col overflow-y-auto p-2">
                <div className="leading-0 flex max-w-3xl flex-col font-dosis text-sm font-semibold uppercase tracking-wide text-slate-700">
                  {/* cart items */}
                  <ul className="flex flex-col divide-y divide-gray-700">
                    {cartItems.length ? (
                      cartItems.map((item) => (
                        <li
                          key={item.colorId}
                          className="flex flex-col py-2 sm:flex-row sm:justify-between"
                        >
                          <div className="flex w-full space-x-2 sm:space-x-4">
                            <img
                              src={`${item.previewImage}`}
                              alt={`${item.productName}`}
                              className="w-1/4 flex-shrink-0 rounded object-cover outline-none"
                            />
                            <div className="flex w-full flex-col gap-y-2 px-2 capitalize">
                              <div className="flex w-full text-base">
                                <div className="flex-1">
                                  <h3>{item.productName}</h3>
                                  <p className="font-semibold">
                                    $ {item.price}
                                  </p>
                                </div>
                                <div className="flex">
                                  <button
                                    onClick={() => clearItemHandler(item)}
                                    type="button"
                                    className="flex w-7"
                                  >
                                    <DeleteIcon />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-4 font-normal">
                                <div className="col-span-1 flex flex-col">
                                  <span className="text-sm">Quantity:</span>
                                  <span className="text-sm">Color:</span>
                                  <span className="text-sm">Size:</span>
                                </div>
                                <div className="col-span-3 flex flex-col">
                                  <span className="text-sm">
                                    {item.quantity}
                                  </span>
                                  <span className="text-sm">{item.color}</span>
                                  <span className="text-sm">{item.size}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <span className="m-auto my-4 font-medium">
                        Your cart is empty
                      </span>
                    )}
                  </ul>
                </div>
              </div>
              {/* cart total */}
              <div className="leading-0 my-8 border-y-2 bg-white p-2 py-4 px-4 font-dosis text-sm uppercase tracking-wide text-slate-700">
                <span className="flex text-lg  font-semibold">
                  <span className="flex-1">Total amount: </span>
                  <span className="flex-none">${cartTotal}</span>
                </span>
                <p className="text-sm text-gray-400">
                  Not including taxes and shipping costs
                </p>
              </div>

              <div className="flex flex-col gap-4 bg-gray-100 p-2 pb-6 pt-0">
                <button
                  onClick={() => setIsIconHover(false)}
                  className="btn h-full w-full rounded-none p-0 shadow-sm"
                >
                  <Link
                    to="/cart"
                    className="flex h-full w-full items-center justify-center"
                  >
                    <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                      my bag
                    </span>
                  </Link>
                </button>
                <button
                  onClick={goToCheckOutHandler}
                  className="btn h-full w-full rounded-none shadow-sm"
                >
                  <div className="flex h-full w-full items-center justify-center ">
                    <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                      CHECK OUT
                    </span>
                  </div>
                </button>
              </div>
            </div>{' '}
          </div>
          <div className="border-b-[1px] border-dashed border-slate-700"></div>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
