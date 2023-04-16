import { useSelector } from 'react-redux';

import { Link, useParams } from 'react-router-dom';
import { selectCategoriesMap, selectCategoriesIsLoading } from '../../store/categories/category.selector';

import Spinner from '../../components/spinner/spinner.component';
import ProductCard from '../../components/product-card/product-card.component';
import { ShopCategoryRouteParams } from '../navigation/navigation.component';


const CategoriesPreview = () => {
  const categoriesMap = useSelector(selectCategoriesMap);
  const isLoading = useSelector(selectCategoriesIsLoading);

  const { shop } = useParams<keyof ShopCategoryRouteParams>() as ShopCategoryRouteParams;
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <> 
      <h2 className="text-4xl mb-6 text-center">{shop.toUpperCase()}</h2>
      <div className="flex flex-col items-center top-0 z-30">
        <div className="container2">
          {
        isLoading ? <Spinner />
          : (Object.keys(categoriesMap).map((title) => {
            const products = categoriesMap[title];
            return (
              <div key={title} className="flex flex-col mb-7">
                <h2>
                  <Link className="text-2xl mb-6 cursor-pointer" to={title}>{title.toUpperCase()}</Link>
                </h2>


                <div className="flex">
                  {products
                    .filter((_, idx) => idx < 4)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </div>
            );
          }))
      }
        </div>
      </div>
    </>
  );
};

export default CategoriesPreview;
