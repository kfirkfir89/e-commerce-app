import { memo } from 'react';
import { CartItemPreview } from '../../store/cart/cart.types';

const CartItem = memo(({ cartItem }: { cartItem:CartItemPreview }) => {
  const {
    productName, previewImage, price, quantity, 
  } = cartItem;
  return (
    <div className="w-full flex mb-4 image-full">
      <img className="w-1/3" src={previewImage} alt={`${productName}`} />
      <div className="w-9/12 flex flex-col items-start justify-center child-span:text-xl">
        <span>{productName}</span>
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
