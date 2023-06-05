import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { lazy, useEffect } from 'react';

import {
  selectCategoriesIsLoading,
  selectCategoriesPreview,
} from '../../store/categories/category.selector';

import { featchPreviewCategories } from '../../store/categories/category.action';

import Spinner from '../../components/spinner/spinner.component';
import { ShopCategoryRouteParams } from '../navigation/navigation.component';

const ProductCard = lazy(
  () => import('../../components/product-card/product-card.component')
);

const CategoriesPreview = () => {
  const { shopPara } = useParams<
    keyof ShopCategoryRouteParams
  >() as ShopCategoryRouteParams;
  const categoriesPreviewMap = useSelector(selectCategoriesPreview);
  const isLoading = useSelector(selectCategoriesIsLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(featchPreviewCategories(shopPara));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopPara]);

  function getCategories() {
    return categoriesPreviewMap.get(shopPara);
  }

  const categories = getCategories();
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      <h2 className="mb-6 mt-36 text-center text-4xl uppercase">{shopPara}</h2>
      <div className="top-0 z-30 flex flex-col items-center">
        <div className="container">
          {isLoading ? (
            <Spinner />
          ) : (
            categories !== undefined &&
            categories.map((category) => {
              return (
                <div key={category.title} className="mb-7 flex flex-col">
                  <h2>
                    <Link
                      className="mb-6 cursor-pointer text-2xl uppercase"
                      to={category.title}
                    >
                      {category.title}
                    </Link>
                  </h2>

                  <div className="grid grid-cols-2 gap-2 px-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
                    {category.items
                      .filter((_, idx) => idx < 4)
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default CategoriesPreview;
