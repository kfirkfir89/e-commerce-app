import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
  selectCategoriesIsLoading,
  selectCategoriesPreview,
} from '../../store/categories/category.selector';

import { featchPreviewCategories } from '../../store/categories/category.action';

import Spinner from '../../components/spinner/spinner.component';
import { ShopCategoryRouteParams } from '../navigation/navigation.component';

const CategoriesPreview = () => {
  const { shopPara } = useParams<
    keyof ShopCategoryRouteParams
  >() as ShopCategoryRouteParams;
  const categoriesPreviewMap = useSelector(selectCategoriesPreview);
  const isLoading = useSelector(selectCategoriesIsLoading);
  const dispatch = useDispatch();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    dispatch(featchPreviewCategories(shopPara));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopPara]);

  function getCategories() {
    return categoriesPreviewMap.get(shopPara);
  }

  const onLoad = () => {
    setTimeout(() => setIsImageLoaded(true), 100);
  };

  const categories = getCategories();
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      <h2 className="mb-6 text-center text-2xl font-semibold capitalize text-gray-600">
        {shopPara}
      </h2>
      <div className="top-0 z-30 flex flex-col items-center px-2">
        <div className="container max-w-5xl">
          <div className="flex w-full flex-col items-center justify-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="flex h-full w-full flex-col items-center gap-8">
                {categories &&
                  categories.map((category) => {
                    return (
                      <div
                        key={category.title}
                        className={`gradient-circle relative flex h-full w-full flex-col items-center justify-center px-2 ${
                          !isImageLoaded ? 'invisible' : 'visible'
                        }`}
                      >
                        <div className="absolute z-50 border-[1px] border-dashed border-slate-700 bg-white bg-opacity-80 p-4 font-dosis text-lg  font-semibold uppercase tracking-widest">
                          <Link to={category.title} className="h-full w-full">
                            {category.title}
                          </Link>
                        </div>
                        <div className=" carousel h-80 p-2">
                          {category.items
                            .filter((_, idx) => idx < 8)
                            .map((product) => (
                              <div
                                key={product.id}
                                className="carousel-item relative"
                              >
                                <div className="absolute h-full w-full bg-black opacity-10" />
                                <img
                                  onLoad={onLoad}
                                  src={`${product.imagesUrls[0]}`}
                                  alt={`${product.productName}`}
                                  className=" flex-shrink-0 rounded-none object-cover outline-none "
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesPreview;
