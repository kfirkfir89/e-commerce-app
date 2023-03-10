import { useDispatch, useSelector } from 'react-redux';

import { addItemToCart } from '../../store/cart/cart.action';
import { selectCartItems } from '../../store/cart/cart.selector';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import { CategoryItem } from '../../store/categories/category.types';

import {
  ProductCartContainer,
  Footer,
  Name,
  Price,
} from './product-card.styles';


const ProductCard = ({ product } : { product: CategoryItem }) => {
  const { name, price, imageUrl } = product;
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const addProductToCart = () => dispatch(addItemToCart(cartItems, product));

  return (
    <div className="flex flex-col shadow-md relative">
      <img src={imageUrl} alt={`${name}`} className="object-cover object-center w-full h-72" />
      <div className="absolute z-10 bottom-4 flex justify-center w-full bg-opacity-40">
        <div className="rounded-full h-10 w-10 bg-white bg-opacity-40  flex justify-center items-center">
          <button type="button" className="text-5xl pb-3 font-thin">+</button>
          <span>{price}</span>
        </div>
      </div>
    </div>
  // <ProductCartContainer>
  //   <img src={imageUrl} alt={`${name}`} />
  //   <Footer>
  //     <Name>{name}</Name>
  //     <Price>{price}</Price>
  //   </Footer>
  //   <Button buttonType={BUTTON_TYPE_CLASSES.inverted} onClick={addProductToCart}>
  //     Add to card
  //   </Button>
  // </ProductCartContainer>
  );
};

export default ProductCard;
