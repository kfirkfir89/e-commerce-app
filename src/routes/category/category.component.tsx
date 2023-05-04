import {
  useState, useEffect, Suspense, memo,
} from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ProductCard from '../../components/product-card/product-card.component';
import Spinner from '../../components/spinner/spinner.component';

import { PreviewCategory } from '../../store/categories/category.types';
import { selectCategories, selectCategoriesIsLoading, selectSortOption } from '../../store/categories/category.selector';
import {
  featchNewSort,
  featchSubCategory, featchUpdateCategory,
} from '../../store/categories/category.action';
import { ItemPreview } from '../../components/add-firebase/add-item.component';
import {
  getCategory,
  getCategoryCount, getSubCategoryDocument, 
} from '../../utils/firebase/firebase.utils';
import Sort from '../../components/sort/Sort';
import { SelectOption } from '../../components/select/select.component';

export type CategoryRouteParams = {
  shop: string;
  subCategoryPara: string;
  item: string;
};

export type SortOption = {
  sort: SelectOption
  colors: SelectOption[]
  sizes: SelectOption[]
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Category = () => {
  let { shop, subCategoryPara } = useParams<keyof CategoryRouteParams>() as CategoryRouteParams;
  const categoriesMap = useSelector(selectCategories);
  const sortOptionSelector = useSelector(selectSortOption);
  const isLoading = useSelector(selectCategoriesIsLoading);
  const [products, setProducts] = useState<ItemPreview[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [countSortOption, setCountSortOption] = useState(0);
  const [sortOption, setSortOption] = useState<SortOption>({
    sort: { label: 'Sort', value: '' }, colors: [], sizes: [], 
  });
  const [prevSortOption, setPrevSortOption] = useState<SortOption>(sortOption);

  const location = useLocation();
  const dispatch = useDispatch();
  // in case use typing path in broswer search no para and state pass we need to definde them 
  if (shop === null && subCategoryPara === undefined) {
    const pathArraySplit = location.pathname.split('/');
    subCategoryPara = pathArraySplit[pathArraySplit.length - 1];
    shop = pathArraySplit[pathArraySplit.length - 2];
  }

  function equalSortsObjects(sortOption: SortOption, prevSortOption: SortOption): boolean {
    if (sortOption.sort.label === 'Sort' || JSON.stringify(sortOption) === JSON.stringify(prevSortOption)) {
      return true;
    }
    return false;
  }
  async function loadData(shop:string, subCategoryPara: string, count: number, sortOption: SortOption, prevSortOption: SortOption) {
    const res = await getSubCategoryDocument(shop, subCategoryPara, count, sortOption, prevSortOption);
    setCountSortOption(res.count);
    const arr = res.sliceItems;
    return arr;
  }
  // const newArray: ItemPreview[] = products;
  // res.sliceItems.filter((item) => !products.some((exsistItem) => item.id === exsistItem.id)).forEach((item) => {
  //   newArray.push(item);
  // });
  function featchDataCategory() {
    setIsLoadingItems(true);
    const asyncfunction = loadData(shop, subCategoryPara, products.length, sortOption, prevSortOption)
      .then((res) => {
        dispatch(featchUpdateCategory(shop, subCategoryPara, res));
        const isSameSort = equalSortsObjects(sortOption, prevSortOption);

        if (isSameSort) {
          const newArray: ItemPreview[] = products;
          res.filter((item) => !products.some((exsistItem) => item.id === exsistItem.id)).forEach((item) => {
            newArray.push(item);
          });
          setProducts((prevProducts) => { return [...newArray]; });
        }
        if (!isSameSort) {
          if (sortOption?.sort.value) {
            if (sortOption.sort.value === 'recommended') {
              setProducts(() => { return [...res].sort((a, b) => a.created.toMillis() - b.created.toMillis()); }); 
            }
            if (sortOption.sort.value === 'new') {
              setProducts(() => { return [...res].sort((a, b) => b.created.toMillis() - a.created.toMillis()); }); 
            }
            if (sortOption.sort.value === 'price-low') {
              setProducts(() => { return [...res].sort((a, b) => a.price - b.price); }); 
            }
            if (sortOption.sort.value === 'price-high') {
              setProducts(() => { return [...res].sort((a, b) => b.price - a.price); }); 
            }
            setProducts(() => { return [...res]; }); 
          } 
          if (sortOption.sizes.length > 0) {
            setProducts(() => {
              return [...res]
                .filter((item) => item.sizesSort
                  .some((size) => sortOption.sizes
                    .some((stateSort) => size === stateSort.value)))
                .sort((a, b) => {
                  let sortResult = 0;
                  if (sortOption.sort.value === 'recommended') {
                    sortResult = a.created.toMillis() - b.created.toMillis();
                  }
                  if (sortOption.sort.value === 'new') {
                    sortResult = b.created.toMillis() - a.created.toMillis();
                  }
                  if (sortOption.sort.value === 'price-low') {
                    sortResult = a.price - b.price;
                  }
                  if (sortOption.sort.value === 'price-high') {
                    sortResult = b.price - a.price;
                  }
                  return sortResult;
                }).filter((item) => res.some((newItem) => newItem.id !== item.id)); 
            }); 
          }
        }
        
        setPrevSortOption(sortOption);
        setTimeout(() => {
          setIsLoadingItems(false);
        }, 800);
      });
  }

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

  useEffect(() => {
    const initialLoad = featchDataCategory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);

  const loadMore = () => {
    const initialLoad = featchDataCategory();
  };

  // set sort option to send it back to sort Select and display the current value also for dispatch the sortOption for future featching of more data
  const onSortChangeHandler = (sort: SelectOption | SelectOption[]) => {
    if ('label' in sort) {
      setSortOption((prevState) => ({ ...prevState, sort }));
    } else {
      setSortOption((prevState) => ({ ...prevState, sizes: sort }));
    }
  };
  const onSortChangeColorHandler = (sort: SelectOption[]) => {
    setSortOption((prevState) => ({ ...prevState, colors: sort }));
  };

  // commit above
  // useEffect(() => {
  //   dispatch(featchNewSort(sortOption));
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sortOption]);

  return (
    <>
      <>
        {/* banner */}
        <div className="flex justify-center mb-4">
          <div className="container">
            <div className="p-6 bg-emerald-200 flex justify-center mx-2">
              <div className="flex flex-col gap-5 items-center justify-between">
                <h2 className="text-center text-5xl tracking-tighter font-bold">
                  Up to 25% Off
                </h2>
                <div className="space-x-2 text-center py-2 lg:py-0">
                  <span className="text-sm">Plus free shipping! Use code:</span>
                  <span className="font-bold">NANA17</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl mb-6 text-center font-semibold text-gray-600">
          {`${shop.charAt(0).toUpperCase() + shop.slice(1, shop.length - 1)}'${shop.charAt(shop.length - 1)}`}
          {' '}
          {subCategoryPara.charAt(0).toUpperCase() + subCategoryPara.slice(1)}
        </h2>

        <Sort onChange={onSortChangeHandler} onChangeColor={onSortChangeColorHandler} valueOption={sortOption} />
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="container">
              <div className="flex flex-col mb-7 mt-4">
                <div className="relative grid grid-cols-2  sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-6 sm:gap-y-10 px-2">

                  {isLoadingItems && (
                  <div className="absolute z-50 h-full w-full bg-gray-400 opacity-50">
                    <Spinner />
                  </div>
                  )}
                  {products
                    && products.map((product, i) => (
                      <div key={product.id}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-center mt-20">
                <div className="flex flex-col justify-center mt-4 ">
                  <p>
                    You&apos;ve viewed
                    {' '}
                    {products.length}
                    {' '}
                    of
                    {' '}
                    {countSortOption}
                    {' '}
                    products
                  </p>
                  <progress className="progress w-56" value={products.length} max={countSortOption}></progress>
                  <button
                    onClick={loadMore}
                    className={`btn btn-ghost hover:btn-accent ${isLoadingItems ? 'loading' : ''} ${countSortOption === products.length ? 'invisible' : ''}`}
                  >
                    load more
                  </button>
                  <button
                    onClick={loadMore}
                  >
                    load more
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </>
      <Outlet />
    </>
  );
};


export default memo(Category);
