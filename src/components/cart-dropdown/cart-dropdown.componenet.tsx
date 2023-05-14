/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import {
  selectCartCount, selectCartItems, selectCartTotal, selectIsCartOpen, 
} from '../../store/cart/cart.selector';
import { ReactComponent as ShoppingIcon } from '../../assets/local_mall.svg';


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
    <div className="z-[100] flex-none">

      <div className="relative">

        <button className="relative flex flex-col justify-center items-center" onClick={() => setIsHover(!isHover)} onMouseEnter={() => setIsHover(true)}>
          <ShoppingIcon className="w-9 sm:w-full mb-1" />
          <span className="absolute text-[10px] opacity-70 sm:text-xs font-bold pt-1">{cartCount}</span>
          <div className={`absolute bottom-0 border-8 w-4 border-transparent border-dashed border-b-slate-700 border-opacity-70 transition-all duration-200 ease-in-out opacity-0 ${isHover ? 'opacity-100' : ''}`}></div>
        </button>
        
        <div className={`fixed right-0 grid grid-rows-[0fr] overflow-hidden max-w-md transition-all duration-500 ease-in-out ${isHover ? 'grid-rows-[1fr]' : ''}`}>
          <div className="min-h-0" onMouseLeave={() => { setTimeout(() => { setIsHover(false); }, 1000); }}>
            <div className="py-4 bg-gray-100">
              <div className="card w-full">
                <div className="h-96 p-2 flex flex-col overflow-y-auto scrollbarStyle">
                  <div className="flex flex-col max-w-3xl tracking-wide font-dosis text-sm font-semibold uppercase leading-0 text-slate-700">
                    <h2>
                      My Bag,
                      {' '}
                      <span className="font-normal">
                        {cartCount}
                        {' '}
                        items
                      </span>
                    </h2>

                    <ul className="flex flex-col divide-y divide-gray-700">
                      {
                        cartItems.length ? cartItems.map((item) => (

                          <li key={item.colorId} className="flex flex-col py-6 sm:flex-row sm:justify-between">
                            <div className="flex w-full space-x-2 sm:space-x-4">
                              <img src={item.previewImage} alt={`${item.productName}`} className="flex-shrink-0 w-1/3 object-cover dark:border-transparent rounded outline-none dark:bg-gray-500" />
                              <div className="flex flex-col justify-between w-full pb-4">
                                <div className="flex justify-between w-full pb-2 space-x-2">
                                  <div className="space-y-1">
                                    <h3 className="text-lg font-semibold leading-snug sm:pr-8">{item.productName}</h3>
                                    <p className="text-sm dark:text-gray-400">{item.quantity}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-semibold">{item.price}</p>
                                  </div>
                                </div>
                                <div className="flex text-sm divide-x">
                                  <button type="button" className="flex items-center px-2 py-1 pl-0 space-x-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current">
                                      <path d="M96,472a23.82,23.82,0,0,0,23.579,24H392.421A23.82,23.82,0,0,0,416,472V152H96Zm32-288H384V464H128Z"></path>
                                      <rect width="32" height="200" x="168" y="216"></rect>
                                      <rect width="32" height="200" x="240" y="216"></rect>
                                      <rect width="32" height="200" x="312" y="216"></rect>
                                      <path d="M328,88V40c0-13.458-9.488-24-21.6-24H205.6C193.488,16,184,26.542,184,40V88H64v32H448V88ZM216,48h80V88H216Z"></path>
                                    </svg>
                                    <span>Remove</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))
                          : (<span className="font-medium m-auto">Your cart is empty</span>)
                      }
                    </ul>

                  </div>
                </div>
                <div className="my-8 py-4 p-2 bg-white px-4 border-y-2 tracking-wide font-dosis text-sm uppercase leading-0 text-slate-700">
                  <span className="flex text-lg">
                    <span className="flex-1">
                      Total amount:
                      {' '}
                    </span>
                    <span className="flex-none">
                      $ 
                      {cartTotal}
                    </span>
                  </span>
                  <p className="text-sm text-gray-400">Not including taxes and shipping costs</p>
                </div>
                <div className="bg-gray-100 p-8 pt-0 border-b-2 tracking-wide font-dosis text-sm uppercase leading-0 text-slate-700">
                  <button className="btn rounded-none btn-sm w-full" onClick={goToCheckOutHandler}>
                    CHECK OUT
                  </button>
                </div>
              </div>
              {' '}
            
            </div>
          </div>
          <div className={`border-dashed border-slate-700 border-b-[1px] transition-all duration-1000 ease-in-out opacity-0 ${isHover ? 'opacity-100' : ''}`}></div>
        </div>

      </div>

    </div>
  

  );
};

export default CartDropdown;
