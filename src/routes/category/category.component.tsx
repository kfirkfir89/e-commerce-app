import {
  useState, useEffect, memo, useCallback,
} from 'react';
import {
  Outlet, useParams, 
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ProductCard from '../../components/product-card/product-card.component';
import Spinner from '../../components/spinner/spinner.component';

import { selectCategories, selectCategoriesIsLoading } from '../../store/categories/category.selector';
import {
  featchUpdateCategory,
} from '../../store/categories/category.action';
import { ItemPreview } from '../../components/add-firebase/add-item.component';
import {
  getCategoryCount,
  getSubCategoryDocument, 
} from '../../utils/firebase/firebase.utils';
import Sort from '../../components/sort/Sort';
import { SelectOption } from '../../components/select/select.component';

export type CategoryRouteParams = {
  shopPara: string;
  subCategoryPara: string;
  itemPara: string;
};

export type SortOption = {
  sort: SelectOption
  colors: SelectOption[]
  sizes: SelectOption[]
};

export type PrevPath = {
  shopPara: string
  subCategoryPara: string
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Category = () => {
  const { shopPara, subCategoryPara } = useParams<keyof CategoryRouteParams>() as CategoryRouteParams;
  const categoriesSelector = useSelector(selectCategories);
  const isLoading = useSelector(selectCategoriesIsLoading);

  const [products, setProducts] = useState<ItemPreview[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [countSortOption, setCountSortOption] = useState(0);
  const [sortOption, setSortOption] = useState<SortOption>({
    sort: { label: 'Sort', value: '' }, colors: [], sizes: [], 
  });
  const [prevSortOption, setPrevSortOption] = useState<SortOption>(sortOption);
  const [pathChanged, setPathChanged] = useState(false);

  const dispatch = useDispatch();

  // check for prevSort and current to be able to know the sort order we need to feaatch from server
  // boolean check so isTheSameSort..
  function equalSortsObjects(sortOption: SortOption, prevSortOption: SortOption): boolean {
    if (JSON.stringify(sortOption.sort) === JSON.stringify(prevSortOption.sort) 
      && JSON.stringify(sortOption.sizes) === JSON.stringify(prevSortOption.sizes)
      && JSON.stringify(sortOption.colors) === JSON.stringify(prevSortOption.colors)) {
      return true;
    }
    return false;
  }
  
  // a featch to server to get a slice 
  async function loadData(shopPara:string, subCategoryPara: string, count: number, sortOption: SortOption, prevSortOption: SortOption) {
    const res = await getSubCategoryDocument(shopPara, subCategoryPara, count, sortOption, prevSortOption);
    setCountSortOption(res.count);
    const arr = res.sliceItems;
    return arr;
  }

  function featchDataCategory() {
    const asyncfunction = loadData(shopPara, subCategoryPara, products.length, sortOption, prevSortOption)
      .then((res) => {
        dispatch(featchUpdateCategory(shopPara, subCategoryPara, res));
        const isSameSort = equalSortsObjects(sortOption, prevSortOption);

        if (isSameSort) {
          const newArray: ItemPreview[] = products;
          res.filter((item) => !products.some((exsistItem) => item.id === exsistItem.id)).forEach((item) => {
            newArray.push(item);
          });
          setProducts([...newArray]);
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
          if (sortOption.colors.length > 0) {
            setProducts(() => {
              return [...res]
                .filter((item) => item.colorsSort
                  .some((color) => sortOption.colors
                    .some((sortColor) => color === sortColor.label)))
                .filter((item) => res.some((newItem) => newItem.id === item.id));
            }); 
          }
          if (sortOption.sizes.length > 0) {
            if (sortOption.colors.length > 0) {
              setProducts(() => {
                return [...res]
                  .filter((item) => item.sizesSort
                    .some((size) => sortOption.sizes
                      .some((stateSort) => size === stateSort.value)))
                  .filter((item) => res.some((newItem) => newItem.id === item.id))
                  .filter((item) => item.stock.some((sizeStock) => sizeStock.colors
                    .some((colorStock) => sortOption.colors
                      .some((sortColor) => sortColor.label === colorStock.label) && colorStock.count > 0))); 
              }); 
            } else {
              setProducts(() => {
                return [...res]
                  .filter((item) => item.sizesSort
                    .some((size) => sortOption.sizes
                      .some((stateSort) => size === stateSort.value)))
                  .filter((item) => res.some((newItem) => newItem.id === item.id)); 
              }); 
            }
          }
        }
        // setPrevSortOption(sortOption);
        setTimeout(() => {
          setIsLoadingItems(false);
        }, 800);
      });
  }

  // reset fields before check for new category
  useEffect(() => {
    setProducts([]);
    setSortOption({
      sort: { label: 'Sort', value: '' }, colors: [], sizes: [], 
    });
    setPathChanged(true);
  }, [shopPara, subCategoryPara]);

  // first load if category exsist load the items
  useEffect(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    if (categoriesSelector.has(shopPara)) {
      const subCategory = categoriesSelector.get(shopPara);
      if (subCategory?.some((mapDocKey) => mapDocKey.title === subCategoryPara)) {
        const array = subCategory.find((category) => category.title === subCategoryPara)!;
        const getCount = async () => {
          const count = await getCategoryCount(shopPara, subCategoryPara).then((count) => setCountSortOption(count));
        };
        setProducts([...array.items.slice(0, 3)]);
        const featchCount = getCount();
        setPathChanged(false);
      } else {
        const initialLoad = featchDataCategory();
        setPrevSortOption(sortOption);
        setPathChanged(false);
      }
    } else {
      const initialLoad = featchDataCategory();
      setPrevSortOption(sortOption);
      setPathChanged(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathChanged]);
  
  
  useEffect(() => {
    if (!(sortOption.sort.label === 'Sort' && sortOption.colors.length === 0 && sortOption.sizes.length === 0)) {
      const initialLoad = featchDataCategory();
      setPrevSortOption(sortOption);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);
  
  const loadMore = () => {
    const moreData = featchDataCategory();
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

  return (
    <>
      <>
        {/* banner */}
        <div className="flex justify-center mb-4 mt-32">
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
          {`${shopPara.charAt(0).toUpperCase() + shopPara.slice(1, shopPara.length - 1)}'${shopPara.charAt(shopPara.length - 1)}`}
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


export default Category;
