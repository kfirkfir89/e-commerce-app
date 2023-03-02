import { useSelector } from 'react-redux';

import { selectCartCount } from '../../store/cart/cart.selector';

import { ReactComponent as ShoppingIcon } from '../../assets/local_mall.svg';

const CartIcon = () => {
  // const { isCartOpen, setIsCartOpen, cartCount } = useContext(CartContext);

  const cartCount = useSelector(selectCartCount);

  return (
    <div tabIndex={0} className="relative flex pb-1 items-center justify-center cursor-pointer hover:text-secondary hover:animate-bounce">
      <ShoppingIcon className="w-9 sm:w-10" />
      <span className="absolute text-[10px] opacity-70 sm:text-xs font-bold pt-3">{cartCount}</span>
    </div>


  );
};

export default CartIcon;
