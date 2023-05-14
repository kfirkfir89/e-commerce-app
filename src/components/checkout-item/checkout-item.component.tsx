import { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectCartItems } from '../../store/cart/cart.selector';
import { addItemToCart, clearItemFromCart, removeItemFromCart } from '../../store/cart/cart.action';


import { CartItemPreview } from '../../store/cart/cart.types';

type CheckoutItemsProps = {
  cartItem: CartItemPreview;
};

const CheckoutItem: FC<CheckoutItemsProps> = ({ cartItem }) => {
  const {
    productName, previewImage, price, quantity, 
  } = cartItem;
  
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);


  const clearItemHandler = () => dispatch(clearItemFromCart(cartItems, cartItem));
  const addItemHandler = () => dispatch(addItemToCart(cartItems, cartItem));
  const removeItemHandler = () => dispatch(removeItemFromCart(cartItems, cartItem));

  return (   
    <div className="w-full flex h-30v border p-4 text-2xl items-center">
      <div className="w-1/4 pr-4">
        <img className="w-full h-full" src={previewImage} alt={`${productName}`} />
      </div>
      <span className="w-1/4">
        {' '}
        {productName}
        {' '}
      </span>
      <button onClick={removeItemHandler} className="flex w-1/4 cursor-pointer">
        &#10094;
      </button>
      <span className="m-2">{quantity}</span>
      <button onClick={addItemHandler} className="flex w-1/4 cursor-pointer">
        &#10095;
      </button>
      <span className="flex w-1/4 cursor-pointer">
        {' '}
        {price}
      </span>
      <button className="pl-3" onClick={clearItemHandler}>&#10005;</button>
    </div>


  );
};

export default CheckoutItem;
