import { memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { NewItemValues } from '../add-firebase/add-item.component';
import { CategoryRouteParams } from '../../routes/category/category.component';

// eslint-disable-next-line react/require-default-props
const ProductCard = ({ product, categoryTitle } : { product: NewItemValues, categoryTitle?: string }) => {
  const {
    productName, price, colorImagesUrls, colors,
  } = product;

  const { subCategoryPara } = useParams<keyof CategoryRouteParams>() as CategoryRouteParams;

  // route dipandancy for navigation from diffrent placeses
  let route = '';
  if (!subCategoryPara) {
    route = `${categoryTitle}/`;
  }
  if (subCategoryPara) {
    route = '';
  }

  return (
    <Link to={`${route}${product.id}`} state={product}>
      <div className="max-w-xs">
        <div className="relative shadow-sm">
          <img key={colorImagesUrls[0].itemUrlList[0]} src={colorImagesUrls[0].itemUrlList[0]} alt={colorImagesUrls[0].itemUrlList[0]} className="object-cover object-center w-full max-h-full transition-opacity duration-200 ease-in-out" />
          <img key={colorImagesUrls[0].itemUrlList[1]} src={colorImagesUrls[0].itemUrlList[1]} alt={colorImagesUrls[0].itemUrlList[1]} className="absolute top-0 left-0 object-cover object-center w-full max-h-full opacity-0 hover:opacity-100 transition-opacity duration-200 ease-in-out" />
        </div>
        <div className="flex flex-col mt-4">
          <div className="pl-1 font-dosis">
            <h2 className="tracking-widest mb-1 text-sm font-semibold">{productName}</h2>
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
    </Link>

  );
};

export default memo(ProductCard);
