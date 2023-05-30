/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  selectIsCartOpen,
} from '../../store/cart/cart.selector';
import { ReactComponent as ShoppingIcon } from '../../assets/shopping-bag.svg';

import { setIsCartOpen } from '../../store/cart/cart.action';
import { resetOrderState } from '../../store/orders/order.action';

const CartDropdown = () => {
  const cartItems = useSelector(selectCartItems);
  const isCartOpen = useSelector(selectIsCartOpen);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);

  const goToCheckOutHandler = useCallback(() => {
    dispatch(setIsCartOpen(!isCartOpen));
    dispatch(resetOrderState());
    navigate('/checkout');
  }, []);

  const test = (leave: string) => {
    if (leave) {
      setTimeout(() => {
        setIsHover(false);
      }, 1000);
    }
  };
  return (
    <div className="relative z-[100]">
      <button
        className="relative flex flex-col items-center justify-center"
        onClick={() => setIsHover(!isHover)}
        onMouseEnter={() => setIsHover(true)}
      >
        <ShoppingIcon className="mb-1 w-9 sm:w-full" />
        <span className="absolute pt-1 text-[10px] font-bold opacity-70 sm:text-xs">
          {cartCount}
        </span>
        <div
          className={`absolute bottom-0 w-4 border-8 border-dashed border-transparent border-b-slate-400 opacity-0 transition-all duration-200 ease-in-out ${
            isHover ? 'opacity-100' : ''
          }`}
        ></div>
      </button>

      <div
        className={`absolute right-1 grid w-72 grid-rows-[0fr] overflow-hidden transition-all duration-500 ease-in-out sm:w-96 ${
          isHover
            ? 'grid-rows-[1fr] border border-b-0 border-slate-400 shadow-md'
            : ''
        }`}
      >
        <div
          className="min-h-0"
          onMouseLeave={() => {
            setTimeout(() => {
              setIsHover(false);
            }, 1000);
          }}
        >
          <div className="bg-gray-100 py-4">
            <div className="card w-full">
              <div className="scrollbarStyle flex h-96 flex-col overflow-y-auto p-2">
                <div className="leading-0 flex max-w-3xl flex-col font-dosis text-sm font-semibold uppercase tracking-wide text-slate-700">
                  <h2>
                    My Bag,{' '}
                    <span className="font-normal">{cartCount} items</span>
                  </h2>

                  <ul className="flex flex-col divide-y divide-gray-700">
                    {cartItems.length ? (
                      cartItems.map((item) => (
                        <li
                          key={item.colorId}
                          className="flex flex-col py-6 sm:flex-row sm:justify-between"
                        >
                          <div className="flex w-full space-x-2 sm:space-x-4">
                            <img
                              src={`${item.previewImage}`}
                              alt={`${item.productName}`}
                              className="w-1/3 flex-shrink-0 rounded object-cover outline-none"
                            />
                            <div className="flex w-full flex-col justify-between pb-4">
                              <div className="flex w-full justify-between space-x-2 pb-2">
                                <div className="space-y-1">
                                  <h3 className="text-lg font-semibold leading-snug sm:pr-8">
                                    {item.productName}
                                  </h3>
                                  <p className="text-sm">{item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-semibold">
                                    {item.price}
                                  </p>
                                </div>
                              </div>
                              <div className="flex divide-x text-sm">
                                <button
                                  type="button"
                                  className="flex items-center space-x-1 px-2 py-1 pl-0"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    className="h-4 w-4 fill-current"
                                  >
                                    <path d="M96,472a23.82,23.82,0,0,0,23.579,24H392.421A23.82,23.82,0,0,0,416,472V152H96Zm32-288H384V464H128Z"></path>
                                    <rect
                                      width="32"
                                      height="200"
                                      x="168"
                                      y="216"
                                    ></rect>
                                    <rect
                                      width="32"
                                      height="200"
                                      x="240"
                                      y="216"
                                    ></rect>
                                    <rect
                                      width="32"
                                      height="200"
                                      x="312"
                                      y="216"
                                    ></rect>
                                    <path d="M328,88V40c0-13.458-9.488-24-21.6-24H205.6C193.488,16,184,26.542,184,40V88H64v32H448V88ZM216,48h80V88H216Z"></path>
                                  </svg>
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <span className="m-auto font-medium">
                        Your cart is empty
                      </span>
                    )}
                  </ul>
                </div>
              </div>
              <div className="leading-0 my-8 border-y-2 bg-white p-2 py-4 px-4 font-dosis text-sm uppercase tracking-wide text-slate-700">
                <span className="flex text-lg">
                  <span className="flex-1">Total amount: </span>
                  <span className="flex-none">${cartTotal}</span>
                </span>
                <p className="text-sm text-gray-400">
                  Not including taxes and shipping costs
                </p>
              </div>
              <div className="leading-0 bg-gray-100 p-2 pb-6  pt-0 font-dosis text-sm uppercase tracking-wide text-slate-700">
                <button
                  onClick={goToCheckOutHandler}
                  className="btn w-full rounded-none shadow-sm "
                >
                  <div className="flex w-full items-center justify-center ">
                    <span className="flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                      CHECK OUT
                    </span>
                  </div>
                </button>
              </div>
            </div>{' '}
          </div>
          <div
            className={`border-b-[1px] border-dashed border-slate-700 opacity-0 transition-all duration-1000 ease-in-out ${
              isHover ? 'opacity-100' : ''
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
