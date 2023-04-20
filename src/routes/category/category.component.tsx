import {
  useState, useEffect, memo,
} from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ProductCard from '../../components/product-card/product-card.component';
import Spinner from '../../components/spinner/spinner.component';

import { Category } from '../../store/categories/category.types';
import { selectCategories, selectCategoriesIsLoading } from '../../store/categories/category.selector';
import {
  featchSubCategory, featchUpdateCategory,
} from '../../store/categories/category.action';
import { NewItemValues } from '../../components/add-firebase/add-item.component';
import { getSubCategoryDocument } from '../../utils/firebase/firebase.utils';

export type CategoryRouteParams = {
  shop: string;
  subCategoryPara: string;
  item: string;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Category = () => {
  let { shop, subCategoryPara } = useParams<keyof CategoryRouteParams>() as CategoryRouteParams;
  const categoriesMap = useSelector(selectCategories);
  const isLoading = useSelector(selectCategoriesIsLoading);
  const [products, setProducts] = useState<NewItemValues[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  // in case use typing path in broswer search no para and state pass we need to definde them 
  if (shop === null && subCategoryPara === undefined) {
    const pathArraySplit = location.pathname.split('/');
    subCategoryPara = pathArraySplit[pathArraySplit.length - 1];
    shop = pathArraySplit[pathArraySplit.length - 2];
  }

  // filter the sub category items
  useEffect(() => {
    const shopCategory = categoriesMap.get(shop);
  
    if (shopCategory && typeof shop === 'string') {
      const filteredProducts: Category | undefined = shopCategory.find((c) => c.title === subCategoryPara);
  
      if (filteredProducts) {
        if (filteredProducts.items.length > 20) {
          setProducts(filteredProducts.items);
          return;
        }
      }
    }
    dispatch(featchSubCategory(shop, subCategoryPara));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shop, subCategoryPara]);

  // update the products
  useEffect(() => {
    const shopCategory = categoriesMap.get(shop);
    if (shopCategory) {
      const subCategoryExsist = shopCategory.some((category: Category) => category.title === subCategoryPara);
      if (subCategoryExsist) {
        const filteredProducts: Category = shopCategory.find((c) => c.title === subCategoryPara)!;
        setProducts(filteredProducts.items);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategoryPara, shop, isLoading]);

  // load more items directly to prevent rerender
  const loadMoreData = (async (shop:string, subCategoryPara: string, count: number) => {
    const res = await getSubCategoryDocument(shop, subCategoryPara, count);
    const newArray: NewItemValues[] = products;
    res.sliceItems.forEach((item) => {
      newArray.push(item);
    });
    return newArray;
  });

  const loadMore = () => {
    setIsLoadingItems(true);
    const asyncfunction = loadMoreData(shop, subCategoryPara, products.length)
      .then((res) => {
        dispatch(featchUpdateCategory(shop, subCategoryPara, res));
        setProducts(() => [...res]); 
        setIsLoadingItems(false);
      });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="container">
          <h2 className="text-4xl mb-6 text-center">{subCategoryPara.toUpperCase()}</h2>
      
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-4 gap-x-5 gap-y-12">
              {products
            && products.map((product, i) => (
              <ProductCard key={product.id} product={product} />
            ))}
            </div>
          )}
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMore}
              className={`btn btn-ghost hover:btn-accent ${isLoadingItems ? 'loading' : ''}`}
            >
              load more
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};


export default memo(Category);
