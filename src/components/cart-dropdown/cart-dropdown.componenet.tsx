/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import { selectCartCount, selectCartItems, selectIsCartOpen } from '../../store/cart/cart.selector';
import CartItem from '../cart-item/cart-item.component';
import { ReactComponent as ShoppingIcon } from '../../assets/local_mall.svg';


import { setIsCartOpen } from '../../store/cart/cart.action';
import { resetOrderState } from '../../store/orders/order.action'; 

import { CartDropdownContainer, EmptyMessage, CartItems } from './cart-dropdown.styles';

const CartDropdown = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const isCartOpen = useSelector(selectIsCartOpen);
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);

  const goToCheckOutHandler = useCallback(() => {
    dispatch(setIsCartOpen(!isCartOpen));
    dispatch(resetOrderState());
    navigate('/checkout');
  }, []);

  return (
    <div className="z-[100] flex-none pr-1 sm:pr-4">
      <div className="w-full dropdown dropdown-end">
        <label>
          <div className="relative sm:pt-[1px] cursor-pointer">
            <div tabIndex={0} className="relative flex items-center justify-center cursor-pointer hover:animate-pulse">
              <ShoppingIcon className="w-9 sm:w-full" />
              <span className="absolute text-[10px] opacity-70 sm:text-xs font-bold pt-2">{cartCount}</span>
            </div>
          </div>
        </label>
        <div tabIndex={0} className="p-2 dropdown-content drop-shadow-2xl bg-base-100 rounded-box w-80 sm:w-96">
          <div className="card w-full">
            <span className="h-96 p-2 flex flex-col overflow-y-auto">
              {
            cartItems.length ? cartItems.map((item) => (
              <CartItem key={item.id} cartItem={item} />
            ))
              : (<span className="font-medium m-auto">Your cart is empty</span>)
          }

            </span>
            <button className="btn btn-secondary m-2" onClick={goToCheckOutHandler}>
              CHECK OUT
            </button>
          </div>
        </div>
      </div>
    </div>
  

  );
};

export default CartDropdown;
