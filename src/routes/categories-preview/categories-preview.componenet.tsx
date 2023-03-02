import { Fragment } from 'react';
import { useSelector } from 'react-redux';

import { selectCategoriesMap, selectCategoriesIsLoading } from '../../store/categories/category.selector';

import CategoryPreview from '../../components/category-preview/category-preview.component';
import Spinner from '../../components/spinner/spinner.component';

const CategoriesPreview = () => {
  const categoriesMap = useSelector(selectCategoriesMap);
  const isLoading = useSelector(selectCategoriesIsLoading);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <> 
      <div className="flex flex-col items-center">
        <div className="container2">
          {
        isLoading ? <Spinner />
          : (Object.keys(categoriesMap).map((title) => {
            const products = categoriesMap[title];
            return (
              <CategoryPreview key={title} title={title} products={products} />
            );
          }))
      }
        </div>
      </div>
    </>
  );
};

export default CategoriesPreview;
