import { useState, useEffect, Fragment } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ProductCard from '../../components/product-card/product-card.component';
import Spinner from '../../components/spinner/spinner.component';

import { Category } from '../../store/categories/category.types';
import { selectCategories, selectCategoriesIsLoading } from '../../store/categories/category.selector';
import { featchSubCategory, featchSubCategoryData } from '../../store/categories/category.action';

export type CategoryRouteParams = {
  subCategoryPara: string;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Category = () => {
  const { subCategoryPara } = useParams<keyof CategoryRouteParams>() as CategoryRouteParams;
  const categoriesMap = useSelector(selectCategories);
  const isLoading = useSelector(selectCategoriesIsLoading);
  const [products, setProducts] = useState<Category | undefined>();
  const [skipItemsCounter, setSkipItemsCounter] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();
  
  // filter the sub category items
  useEffect(() => {
    const shopCategory = categoriesMap.get(location.state);
    console.log('shopCategory:', shopCategory)
    if (shopCategory && typeof location.state === 'string') {
      const subCategoryExsist = shopCategory.some((category: Category) => category.title === subCategoryPara);
      if (subCategoryExsist) {
        const filteredProducts: Category = shopCategory.find((c) => c.title === subCategoryPara)!;
        if (filteredProducts.items.length > 20) {
          setProducts(filteredProducts);
        } else {
          dispatch(featchSubCategoryData(location.state, subCategoryPara, skipItemsCounter));
        }
      } else {
        dispatch(featchSubCategory(location.state, subCategoryPara));
      }
    } else {
      dispatch(featchSubCategory(location.state, subCategoryPara));
    }

    // });
  }, [location.state, subCategoryPara]);

  // update the products
  useEffect(() => {
    const shopCategory = categoriesMap.get(location.state);
    if (shopCategory) {
      const subCategoryExsist = shopCategory.some((category: Category) => category.title === subCategoryPara);
      if (subCategoryExsist) {
        const filteredProducts: Category = shopCategory.find((c) => c.title === subCategoryPara)!;
        setProducts(filteredProducts);
      }
    }
  }, [categoriesMap, subCategoryPara, location.state]);

  useEffect(() => {
    if (products !== undefined) {
      setSkipItemsCounter(products.items.length);
    }
  }, [products]);

  return (
    <>
      <h2>category page</h2>
      <h2 className="text-4xl mb-6 text-center">{subCategoryPara.toUpperCase()}</h2>
      
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-4 gap-x-5 gap-y-12">
          {products
            && products.items.map((product, i) => (
              products.title === subCategoryPara
              && <ProductCard key={product.productName} product={product} />
            ))}
        </div>
      )}
    </>
  );
};


export default Category;
