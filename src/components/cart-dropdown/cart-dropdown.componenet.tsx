/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import {
  selectCartCount, selectCartItems, selectCartTotal, selectIsCartOpen, 
} from '../../store/cart/cart.selector';
import { ReactComponent as ShoppingIcon } from '../../assets/local_mall.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';



import { clearItemFromCart, setIsCartOpen } from '../../store/cart/cart.action';
import { resetOrderState } from '../../store/orders/order.action'; 
import { CartItemPreview } from '../../store/cart/cart.types';


const CartDropdown = () => {
  const cartItems = useSelector(selectCartItems);
  const isCartOpen = useSelector(selectIsCartOpen);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isIconHover, setIsIconHover] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const goToCheckOutHandler = useCallback(() => {
    dispatch(setIsCartOpen(!isCartOpen));
    dispatch(resetOrderState());
    navigate('/checkout');
  }, []);

    
  useEffect(() => {
    if (isHover) {
      setIsIconHover(true);
    } else {
      const timeout = setTimeout(() => {
        setIsIconHover(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isHover]);

  const clearItemHandler = (item: CartItemPreview) => dispatch(clearItemFromCart(cartItems, item));
  
  return (
    <div className="z-[100] relative">

      <button className="relative flex flex-col justify-center items-center" onClick={() => setIsIconHover(!isIconHover)} onMouseEnter={() => setIsIconHover(true)} onMouseLeave={() => setIsIconHover(false)}>
        <ShoppingIcon className="w-9 mb-1" />
        <span className="absolute text-[10px] opacity-70 sm:text-xs font-bold pt-1">{cartCount}</span>
        <div className={`absolute bottom-0 border-8 w-4 border-transparent border-dashed border-b-slate-400 transition-all duration-200 ease-in-out opacity-0 ${isIconHover ? 'opacity-100' : ''}`}></div>
      </button>

      <div className={`absolute right-1 w-72 sm:w-96 grid grid-rows-[0fr] overflow-hidden transition-all duration-500 ease-in-out ${isIconHover ? 'grid-rows-[1fr] border border-slate-400 border-b-0 shadow-md' : ''}`}>
        <div className="min-h-0" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
          <div className="py-4 bg-gray-100">
            <div className="card w-full">
              <div className="max-h-96 p-2 flex flex-col overflow-y-auto scrollbarStyle">
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

                  {/* cart items */}
                  <ul className="flex flex-col divide-y divide-gray-700">
                    {
                      cartItems.length ? cartItems.map((item) => (

                        <li key={item.colorId} className="flex flex-col py-2 sm:flex-row sm:justify-between">
                          <div className="flex w-full space-x-2 sm:space-x-4">
                            <img src={`${item.previewImage}`} alt={`${item.productName}`} className="flex-shrink-0 w-1/4 object-cover dark:border-transparent rounded outline-none dark:bg-gray-500" />
                            <div className="flex flex-col gap-y-2 w-full px-2 capitalize">

                              <div className="flex text-base w-full">
                                <div className="flex-1">
                                  <h3>{item.productName}</h3>
                                  <p className="font-semibold">
                                    $
                                    {' '}
                                    {item.price}
                                  </p>                              
                                </div>
                                <div className="flex">
                                  <button onClick={() => clearItemHandler(item)} type="button" className="flex w-7">
                                    <DeleteIcon />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-4 font-normal">
                                <div className="flex flex-col col-span-1">                                  
                                  <span className="text-sm dark:text-gray-400">
                                    Quantity:
                                  </span>
                                  <span className="text-sm dark:text-gray-400">
                                    Color:
                                  </span>
                                  <span className="text-sm dark:text-gray-400">
                                    Size:
                                  </span>
                                </div>
                                <div className="flex flex-col col-span-3">                                  
                                  <span className="text-sm dark:text-gray-400">
                                    {item.quantity}
                                  </span>
                                  <span className="text-sm dark:text-gray-400">
                                    {item.color}
                                  </span>
                                  <span className="text-sm dark:text-gray-400">
                                    {item.size}
                                  </span>
                                </div>
                              </div>

                            </div>
                          </div>
                        </li>
                      ))
                        : (<span className="font-medium m-auto my-4">Your cart is empty</span>)
                    }
                  </ul>

                </div>
              </div>

              {/* cart total */}
              <div className="my-8 py-4 p-2 bg-white px-4 border-y-2 tracking-wide font-dosis text-sm uppercase leading-0 text-slate-700">
                <span className="flex text-lg  font-semibold">
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

              <div className="bg-gray-100 p-2 pb-6 pt-0  tracking-wide font-dosis text-sm uppercase leading-0 text-slate-700">
                <button onClick={goToCheckOutHandler} className="btn rounded-none w-full shadow-sm ">
                  <div className="w-full flex justify-center items-center ">
                    <span className="uppercase flex pt-1 font-smoochSans font-semibold text-xs tracking-widest">
                      CHECK OUT
                    </span>
                  </div>
                </button>
              </div>
            </div>
            {' '}
                
          </div>
          <div className={`border-dashed border-slate-700 border-b-[1px] transition-all duration-1000 ease-in-out opacity-0 ${isHover ? 'opacity-100' : ''}`}></div>
        </div>
      </div>


    </div>
  

  );
};

export default CartDropdown;
