import { memo, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ItemPreview } from '../add-firebase/add-item.component';
import { CategoryRouteParams } from '../../routes/category/category.component';
import Spinner from '../spinner/spinner.component';


// eslint-disable-next-line react/require-default-props
const ProductCard = ({ product, categoryTitle } : { product: ItemPreview, categoryTitle?: string }) => {
  const {
    productName, price, imagesUrls, colors,
  } = product;

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { subCategoryPara } = useParams<keyof CategoryRouteParams>() as CategoryRouteParams;

  // route dipandancy for navigation from diffrent placeses
  let route = '';
  if (!subCategoryPara) {
    route = `${categoryTitle}/`;
  }
  if (subCategoryPara) {
    route = '';
  }

  const onLoad = () => {
    setTimeout(() => setIsImageLoaded(true), 800);
  };

  return (

    <div className={`max-w-xs ${!isImageLoaded ? 'invisible' : 'visible'}`}>
      <Link to={`${route}${product.productName}`} state={product}>
        <div className="relative shadow-sm">
          <img onLoad={onLoad} key={imagesUrls[0]} src={imagesUrls[0]} alt={imagesUrls[0]} className="object-cover object-center w-full max-h-full transition-opacity duration-200 ease-in-out" />
          <img onLoad={onLoad} key={imagesUrls[1]} src={imagesUrls[1]} alt={imagesUrls[1]} className="absolute top-0 left-0 object-cover object-center w-full max-h-full opacity-0 hover:opacity-100 transition-opacity duration-200 ease-in-out" />
        </div>
      </Link>
      <div className="flex flex-col mt-4">
        <div className="pl-1 font-dosis">
          <Link to={`${route}${product.productName}`} state={product}> 
            <h2 className="tracking-widest mb-1 text-sm font-semibold">{productName}</h2>
          </Link>
          <p className="font-semibold text-sm tracking-wide mb-1">
            $
            {' '}
            {price}
          </p>
          <div className="flex gap-1">
            {colors.map((c) => <div key={c.label} className={`${c.value} w-2 h-2 rounded-full border-gray-700 border border-opacity-30`}></div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);
