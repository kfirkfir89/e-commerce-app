import { useDispatch, useSelector } from 'react-redux';

import { Link, useParams } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { selectCategoriesIsLoading, selectCategoriesPreview } from '../../store/categories/category.selector';

import Spinner from '../../components/spinner/spinner.component';
import { ShopCategoryRouteParams } from '../navigation/navigation.component';
import { featchPreviewCategories } from '../../store/categories/category.action';

const ProductCard = lazy(() => import('../../components/product-card/product-card.component'));

const CategoriesPreview = () => {
  const { shop } = useParams<keyof ShopCategoryRouteParams>() as ShopCategoryRouteParams;
  const categoriesPreviewMap = useSelector(selectCategoriesPreview);
  const isLoading = useSelector(selectCategoriesIsLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(featchPreviewCategories(shop));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getCategories() {
    return categoriesPreviewMap.get(shop);
  }
    
  const categories = getCategories();
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <> 
      <h2 className="text-4xl mb-6 text-center">{shop.toUpperCase()}</h2>
      <div className="flex flex-col items-center top-0 z-30">
        <div className="container">
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
                      <ProductCard key={product.id} product={product} categoryTitle={category.title} />
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
