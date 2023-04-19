import { useDispatch, useSelector } from 'react-redux';

import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { selectCategories, selectCategoriesIsLoading } from '../../store/categories/category.selector';

import Spinner from '../../components/spinner/spinner.component';
import ProductCard from '../../components/product-card/product-card.component';
import { ShopCategoryRouteParams } from '../navigation/navigation.component';
import { featchPreviewCategories } from '../../store/categories/category.action';
import { Category } from '../../store/categories/category.types';

const CategoriesPreview = () => {
  const { shop } = useParams<keyof ShopCategoryRouteParams>() as ShopCategoryRouteParams;
  const categoriesMap = useSelector(selectCategories);
  const isLoading = useSelector(selectCategoriesIsLoading);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(featchPreviewCategories());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getCategories() {
    return categoriesMap.get(location.state);
  }
    
  const categories = getCategories();

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <> 
      <h2 className="text-4xl mb-6 text-center">{shop.toUpperCase()}</h2>
      <div className="flex flex-col items-center top-0 z-30">
        <div className="container2">
          {
        isLoading ? <Spinner />
          : (categories !== undefined && categories.map((category) => {
            return (
              <div key={category.title} className="flex flex-col mb-7">
                <h2>
                  <Link className="text-2xl mb-6 cursor-pointer" to={category.title}>{category.title.toUpperCase()}</Link>
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 px-2">
                  {category.items
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
