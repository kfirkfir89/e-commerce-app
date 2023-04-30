import {
  useState, useEffect, memo, Suspense,
} from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ProductCard from '../../components/product-card/product-card.component';
import Spinner from '../../components/spinner/spinner.component';

import { PreviewCategory } from '../../store/categories/category.types';
import { selectCategories, selectCategoriesIsLoading } from '../../store/categories/category.selector';
import {
  featchSubCategory, featchUpdateCategory,
} from '../../store/categories/category.action';
import { ItemPreview } from '../../components/add-firebase/add-item.component';
import {
  getCategoryCount, getSubCategoryDocument, 
} from '../../utils/firebase/firebase.utils';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';

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
  const [products, setProducts] = useState<ItemPreview[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [categoryCount, setCategoryCount] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();

  // in case use typing path in broswer search no para and state pass we need to definde them 
  if (shop === null && subCategoryPara === undefined) {
    const pathArraySplit = location.pathname.split('/');
    subCategoryPara = pathArraySplit[pathArraySplit.length - 1];
    shop = pathArraySplit[pathArraySplit.length - 2];
  }

  // get category count
  useEffect(() => {
    const getCount = async () => {
      try {
        const count = await getCategoryCount(shop, subCategoryPara);
        setCategoryCount(count);
      } catch (error) {
        console.log('error:', error);
      }
    };
    const res = getCount();
  }, [shop, subCategoryPara]);
  // filter the sub category items
  useEffect(() => {
    const shopCategory = categoriesMap.get(shop);
  
    if (shopCategory && typeof shop === 'string') {
      const filteredProducts: PreviewCategory | undefined = shopCategory.find((c) => c.title === subCategoryPara);
  
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
      const subCategoryExsist = shopCategory.some((category: PreviewCategory) => category.title === subCategoryPara);
      if (subCategoryExsist) {
        const filteredProducts: PreviewCategory = shopCategory.find((c) => c.title === subCategoryPara)!;
        setProducts(filteredProducts.items);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategoryPara, shop, isLoading]);

  // load more items directly to prevent rerender
  const loadMoreData = (async (shop:string, subCategoryPara: string, count: number) => {
    const res = await getSubCategoryDocument(shop, subCategoryPara, count);
    const newArray: ItemPreview[] = products;
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
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <h2 className="text-2xl mb-6 text-center">
            {`${shop.charAt(0).toUpperCase() + shop.slice(1, shop.length - 1)}'${shop.charAt(shop.length - 1)}`}
            {' '}
            {subCategoryPara.charAt(0).toUpperCase() + subCategoryPara.slice(1)}
          </h2>
          <div className="flex flex-col items-center justify-center">
            <div className="container">
              <div className="flex flex-col mb-7">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 px-2">
                  {products
                && products.map((product, i) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                </div>
              </div>

              <div className="flex justify-center pt-14">
                <div className="flex flex-col justify-center mt-4">
                  <p>
                    You&apos;ve viewed
                    {' '}
                    {products.length}
                    {' '}
                    of
                    {' '}
                    {categoryCount}
                    {' '}
                    products
                  </p>
                  <progress className="progress w-56" value={products.length} max={categoryCount}></progress>
                  <button
                    onClick={loadMore}
                    className={`btn btn-ghost hover:btn-accent ${isLoadingItems ? 'loading' : ''} ${categoryCount === products.length ? 'invisible' : ''}`}
                  >
                    load more
                  </button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
      <Outlet />
    </>
  );
};


export default memo(() => (
  <Suspense fallback={<Spinner />}>
    <Category />
  </Suspense>
));
