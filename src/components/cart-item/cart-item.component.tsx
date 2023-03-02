import { memo } from 'react';
import { CartItemQuantity } from '../../store/cart/cart.types';

const CartItem = memo(({ cartItem }: { cartItem:CartItemQuantity }) => {
  const {
    name, imageUrl, price, quantity, 
  } = cartItem;
  return (
    <div className="w-full flex mb-4 image-full">
      <img className="w-1/3" src={imageUrl} alt={`${name}`} />
      <div className="w-9/12 flex flex-col items-start justify-center child-span:text-xl">
        <span>{name}</span>
        <span>
          {quantity}
          {' '}
          x $
          {price}
        </span>
      </div>
    </div>
    
    
  );
});

export default CartItem;
