import { memo } from 'react';
import { CartItemQuantity } from '../../store/cart/cart.types';
import { CartItemContainer, ItemDetails } from './cart-item.styles';


const CartItem = memo(({ cartItem }: { cartItem:CartItemQuantity }) => {
  const {
    name, imageUrl, price, quantity, 
  } = cartItem;
  return (
    <CartItemContainer>
      <img src={imageUrl} alt={`${name}`} />
      <ItemDetails>
        <span>{name}</span>
        <span>
          {quantity}
          {' '}
          x $
          {price}
        </span>
      </ItemDetails>
    </CartItemContainer>
  );
});

export default CartItem;
