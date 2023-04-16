import { useDispatch, useSelector } from 'react-redux';

import { addItemToCart } from '../../store/cart/cart.action';
import { selectCartItems } from '../../store/cart/cart.selector';

import { NewItemValues } from '../add-firebase/add-item.component';


const ProductCard = ({ product } : { product: NewItemValues }) => {
  const {
    productName, price, colorImagesUrls, colors, stock, 
  } = product;
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const addProductToCart = () => dispatch(addItemToCart(cartItems, product));

  return (
    <div className="flex w-full flex-col relative">
      <div className="max-h-96 carousel carousel-vertical">
        {colorImagesUrls.map((color) => color.itemUrlList.filter((_, i) => i < 2)
          .map((image) => (
            <div key={image} className="carousel-item  h-full relative">
              <img src={image} alt={image} />
            </div>
          )))}
      </div>
      <div className="absolute z-10 bottom-28 flex justify-center w-full bg-opacity-40">
        <div className="rounded-full h-10 w-10 bg-white bg-opacity-40  flex justify-center items-center">
          <button type="button" className="text-5xl pb-3 font-thin" onClick={addProductToCart}>+</button>
        </div>
      </div>
      <div className="flex flex-col p-2 pb-4 gap-1">
        <h2>{productName}</h2>
        <div className="flex gap-1">
          <div className="flex flex-1 flex-col gap-1">
            <span>
              $
              {price}
            </span>
            <div className="flex gap-1">
              {colors.map((c) => <div key={c.label} className={`${c.value} w-4 h-4 rounded-full border-gray-700 border border-opacity-30`}></div>)}
            </div>
          </div>
          <div className="flex-none">
            <div className="rounded-full h-10 w-10 hover:bg-gray-100 bg-white active:bg-green-200  flex justify-center items-center">
              <button type="button" className="text-5xl pb-3 font-thin opacity-50 hover:opacity-100" onClick={addProductToCart}>+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ProductCard;
