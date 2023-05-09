import {
  useState, useEffect,
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
import { ReactComponent as Close } from '../../assets/close_FILL0.svg';
import { ReactComponent as SortIcon } from '../../assets/sort_FILL0_wght200.svg';


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
  const [isFilterToggled, setIsFilterToggled] = useState(false);

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
    setIsLoadingItems(true);
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
  // filter toggle for small screen behaiver
  const filterToggleHandler = () => {
    setIsFilterToggled(!isFilterToggled);
  };

  return (
    <>
      <>
        {/* banner */}
        <div className="flex justify-center mb-4 ">
          <div className="container">
            <div className="p-6 bg-emerald-200 flex justify-center mx-2">
              <div className="flex flex-col sm:gap-5 items-center justify-between">
                <h2 className="text-center text-2xl sm:text-5xl tracking-tighter font-bold">
                  Up to 25% Off
                </h2>
                <div className="space-x-2 text-center py-2 lg:py-0">
                  <span className="text-sm">Plus free shipping! Use code:</span>
                  <span className="font-bold text-sm sm:text-base">NANA17</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* title */}
        <h2 className="text-2xl mb-6 text-center font-semibold text-gray-600">
          {`${shopPara.charAt(0).toUpperCase() + shopPara.slice(1, shopPara.length - 1)}'${shopPara.charAt(shopPara.length - 1)}`}
          {' '}
          {subCategoryPara.charAt(0).toUpperCase() + subCategoryPara.slice(1)}
        </h2>
        {/* sort option */}
        <div className="bg-gray-100">
          {/* small screen button */}
          <div className="flex justify-end sm:hidden py-3 px-2">
            <button onClick={filterToggleHandler} className="cursor-pointer container flex flex-shrink items-center border-t-4 border-b-4 border-gray-300 border-double bg-transparent max-w-[10rem] min-h-[2rem] p-2">
              <span className="flex-grow flex gap-2 flex-wrap font-semibold text-gray-500">
                Filters
              </span>
              <SortIcon className="w-6 h-6" />
            </button>
          </div>
          {/* small screen version */}
          <div className={`absolute inset-0 w-full h-screen bg-white z-[100] ${isFilterToggled ? 'block' : 'hidden'}`}>
            <div className="flex justify-center">
              <div className="flex-col w-full">
                <div className="flex justify-end p-5">
                  <button onClick={filterToggleHandler}>
                    <Close className="w-9 h-9" />
                  </button>
                </div>
                <h2 className="text-2xl my-6 text-center font-semibold text-gray-600">
                  Filter Options
                </h2>
                <Sort onChange={onSortChangeHandler} onChangeColor={onSortChangeColorHandler} valueOption={sortOption} />
                <div className="flex justify-center">
                  <button onClick={filterToggleHandler} className="absolute bottom-24 left- btn btn-primary">
                    close
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* any screen version */}
          <div className="sm:block hidden">
            <Sort onChange={onSortChangeHandler} onChangeColor={onSortChangeColorHandler} valueOption={sortOption} />
          </div>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className={`flex-col items-center justify-center ${isFilterToggled ? 'hidden' : 'flex'}`}>
            <div className="container">
              {/* products rendering */}
              <div className="flex flex-col mb-7 mt-4">
                <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 gap-2 sm:gap-4 mx-2 sm:gap-y-10">

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

              {/* prodcts counter */}
              <div className="flex justify-center mt-20">
                <div className="flex flex-col gap-2 justify-center mt-4 text-sm tracking-widest text-slate-900 font-smoochSans leading-0">
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
                  <progress className="progress progress-accent max-w-xs " value={products.length} max={countSortOption}></progress>
                  <button
                    onClick={loadMore}
                    className={`btn btn-ghost btn-sm my-4 hover:btn-accent ${isLoadingItems ? 'loading' : ''} ${countSortOption === products.length ? 'invisible' : ''}`}
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
