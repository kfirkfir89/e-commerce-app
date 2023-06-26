import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getCategoryCount,
  getSubCategoryDocument,
  getUserKeysDocs,
} from '../../utils/firebase/firebase.category.utils';

import {
  selectCategories,
  selectCategoriesIsLoading,
} from '../../store/categories/category.selector';

import { featchUpdateCategory } from '../../store/categories/category.action';

import { ReactComponent as Close } from '../../assets/close_FILL0.svg';
import { ReactComponent as SortIcon } from '../../assets/sort_FILL0_wght200.svg';

import { SelectOption } from '../../components/select/select.component';
import { ItemPreview } from '../../components/add-firebase/add-item.component';
import Spinner from '../../components/spinner/spinner.component';
import SortFilter from '../../components/sort-filter/sort-filter.component';
import ProductCard from '../../components/product-card/product-card.component';

export type CategoryRouteParams = {
  shopPara: string;
  subCategoryPara: string;
  itemPara: string;
};

export type SortOption = {
  sort: SelectOption;
  colors: SelectOption[];
  sizes: SelectOption[];
};

export type PrevPath = {
  shopPara: string;
  subCategoryPara: string;
};

const Category = () => {
  const { shopPara, subCategoryPara } = useParams<
    keyof CategoryRouteParams
  >() as CategoryRouteParams;
  const categoriesSelector = useSelector(selectCategories);
  const isLoading = useSelector(selectCategoriesIsLoading);

  const [products, setProducts] = useState<ItemPreview[]>([]);
  const [subCategoryKeys, setSubCategoryKeys] = useState<string[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [countSortOption, setCountSortOption] = useState(0);
  const [sortOption, setSortOption] = useState<SortOption>({
    sort: { label: 'Sort', value: '' },
    colors: [],
    sizes: [],
  });
  const [prevSortOption, setPrevSortOption] = useState<SortOption>(sortOption);
  const [pathChanged, setPathChanged] = useState(false);
  const [isFilterToggled, setIsFilterToggled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // check for prevSort and current to be able to know the sort order we need to feaatch from server
  // boolean check so isTheSameSort..
  function equalSortsObjects(
    sortOption: SortOption,
    prevSortOption: SortOption
  ): boolean {
    if (
      JSON.stringify(sortOption.sort) === JSON.stringify(prevSortOption.sort) &&
      JSON.stringify(sortOption.sizes) ===
        JSON.stringify(prevSortOption.sizes) &&
      JSON.stringify(sortOption.colors) ===
        JSON.stringify(prevSortOption.colors)
    ) {
      return true;
    }
    return false;
  }
  // a featch to server to get a slice
  async function loadData(
    shopPara: string,
    subCategoryPara: string,
    count: number,
    sortOption: SortOption,
    prevSortOption: SortOption
  ) {
    try {
      const res = await getSubCategoryDocument(
        shopPara,
        subCategoryPara,
        count,
        sortOption,
        prevSortOption
      );
      setCountSortOption(res.count);
      const arr = res.sliceItems;
      return arr;
    } catch (error) {
      return navigate('/error', { state: error as Error });
    }
  }

  function featchDataCategory() {
    setIsLoadingItems(true);
    const asyncfunction = loadData(
      shopPara,
      subCategoryPara,
      products.length,
      sortOption,
      prevSortOption
    ).then((res) => {
      if (!res) return;
      // return navigate('/error', { state: 'page doesnt exsist' });
      dispatch(featchUpdateCategory(shopPara, subCategoryPara, res));
      const isSameSort = equalSortsObjects(sortOption, prevSortOption);

      if (isSameSort) {
        const newArray: ItemPreview[] = products;
        res
          .filter(
            (item) => !products.some((exsistItem) => item.id === exsistItem.id)
          )
          .forEach((item) => {
            newArray.push(item);
          });
        setProducts([...newArray]);
      }
      if (!isSameSort) {
        if (sortOption?.sort.value) {
          if (sortOption.sort.value === 'recommended') {
            setProducts(() => {
              return [...res].sort(
                (a, b) => a.created.toMillis() - b.created.toMillis()
              );
            });
          }
          if (sortOption.sort.value === 'new') {
            setProducts(() => {
              return [...res].sort(
                (a, b) => b.created.toMillis() - a.created.toMillis()
              );
            });
          }
          if (sortOption.sort.value === 'price-low') {
            setProducts(() => {
              return [...res].sort((a, b) => a.price - b.price);
            });
          }
          if (sortOption.sort.value === 'price-high') {
            setProducts(() => {
              return [...res].sort((a, b) => b.price - a.price);
            });
          }
          setProducts(() => {
            return [...res];
          });
        }
        if (sortOption.colors.length > 0) {
          setProducts(() => {
            return [...res]
              .filter((item) =>
                item.colorsSort.some((color) =>
                  sortOption.colors.some(
                    (sortColor) => color === sortColor.label
                  )
                )
              )
              .filter((item) => res.some((newItem) => newItem.id === item.id));
          });
        }
        if (sortOption.sizes.length > 0) {
          if (sortOption.colors.length > 0) {
            setProducts(() => {
              return [...res]
                .filter((item) =>
                  item.sizesSort.some((size) =>
                    sortOption.sizes.some(
                      (stateSort) => size === stateSort.value
                    )
                  )
                )
                .filter((item) => res.some((newItem) => newItem.id === item.id))
                .filter((item) =>
                  item.stock.some((sizeStock) =>
                    sizeStock.colors.some(
                      (colorStock) =>
                        sortOption.colors.some(
                          (sortColor) => sortColor.label === colorStock.label
                        ) && colorStock.count > 0
                    )
                  )
                );
            });
          } else {
            setProducts(() => {
              return [...res]
                .filter((item) =>
                  item.sizesSort.some((size) =>
                    sortOption.sizes.some(
                      (stateSort) => size === stateSort.value
                    )
                  )
                )
                .filter((item) =>
                  res.some((newItem) => newItem.id === item.id)
                );
            });
          }
        }
        setProducts(() => {
          return [...res];
        });
      }
      setTimeout(() => {
        setIsLoadingItems(false);
      }, 100);
    });
  }
  // get the subcategories key in case the is all collection search(no docKey)
  // for rendering links to sub categories
  // reset fields before check for new category
  useEffect(() => {
    const getSubKeys = async () => {
      try {
        const keys = await getUserKeysDocs(shopPara);
        setSubCategoryKeys(keys);
      } catch (error) {
        return navigate('/');
        console.log('error:', error);
      }
    };
    setProducts([]);
    setSortOption({
      sort: { label: 'Sort', value: '' },
      colors: [],
      sizes: [],
    });
    setPathChanged(true);
    setSubCategoryKeys([]);
    if (!subCategoryPara) {
      const fetchKeys = getSubKeys();
    }
  }, [navigate, shopPara, subCategoryPara]);

  // first load if category exsist load the items
  useEffect(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    if (categoriesSelector.has(shopPara)) {
      const subCategory = categoriesSelector.get(shopPara);
      if (
        subCategory?.some((mapDocKey) => mapDocKey.title === subCategoryPara)
      ) {
        const array = subCategory.find(
          (category) => category.title === subCategoryPara
        )!;
        const getCount = async () => {
          const count = await getCategoryCount(shopPara, subCategoryPara).then(
            (count) => setCountSortOption(count)
          );
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
    if (
      !(
        sortOption.sort.label === 'Sort' &&
        sortOption.colors.length === 0 &&
        sortOption.sizes.length === 0
      )
    ) {
      const initialLoad = featchDataCategory();
      setPrevSortOption(sortOption);
    }
    const initialLoad = featchDataCategory();
    setPrevSortOption(sortOption);

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
    <div className=" h-full w-full bg-white">
      {subCategoryKeys.length === 0 && (
        <div className="mb-4 flex justify-center ">
          <div className="container">
            <div className="h-18 mx-2 flex py-2">
              <div className="flex  w-full flex-col items-center justify-between bg-emerald-200 ">
                <div className="flex">
                  <h2 className="flex text-center font-smoochSans text-lg font-semibold tracking-normal">
                    SUMMER TIME
                  </h2>
                  <div className=" rotate-12 px-1 pt-1 text-sm">⛱️</div>
                </div>
                <div className="flex space-x-2 text-center lg:py-0">
                  <span className="pb-1 text-sm leading-4">
                    30% off $80 + free shipping
                  </span>
                </div>
              </div>
              <div className="flex w-full  justify-center bg-[#F4EDDD] font-dosis tracking-wider text-slate-700">
                <div className="flex w-full justify-center ">
                  <div className="flex w-full flex-col items-center justify-between ">
                    <h2 className="text-center font-smoochSans text-lg font-semibold tracking-normal ">
                      Up to 17% Off
                    </h2>
                    <div className="space-x-2  text-center ">
                      <span className="text-sm">
                        Plus free shipping! Use code:
                      </span>
                      <span className="text-sm font-bold ">NANA17</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* title */}
      <h2 className="mb-6 text-center text-2xl font-semibold capitalize text-gray-600">
        {`${
          shopPara.charAt(0).toUpperCase() +
          shopPara.slice(1, shopPara.length - 1)
        }'${shopPara.charAt(shopPara.length - 1)}`}{' '}
        {subCategoryPara}
      </h2>
      {/* render sub buttons or bunner */}
      <div>
        {subCategoryKeys.length > 0 && (
          <div className="mb-4 flex flex-wrap justify-center gap-4 font-smoochSans tracking-wider text-slate-700">
            {subCategoryKeys.map((key) => (
              <Link
                key={key}
                to={key}
                className=" btn-ghost btn-sm btn text-xs leading-8"
              >
                {key}
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* sort option */}
      <div className="bg-gray-100">
        {/* small screen button */}
        <div className="flex justify-end px-2 py-3 sm:hidden">
          <button
            onClick={filterToggleHandler}
            className="container flex min-h-[2rem] max-w-[10rem] flex-shrink cursor-pointer items-center border-b-4 border-t-4 border-double border-gray-300 bg-transparent p-2"
          >
            <span className="flex flex-grow flex-wrap gap-2 font-semibold text-gray-500">
              Filters
            </span>
            <SortIcon className="h-6 w-6" />
          </button>
        </div>
        {/* small screen version */}
        <div
          className={`absolute inset-0 z-[102] h-screen w-full bg-white ${
            isFilterToggled ? 'block' : 'hidden'
          }`}
        >
          <div className="flex justify-center">
            <div className="w-full flex-col">
              <div className="flex justify-end p-5">
                <button onClick={filterToggleHandler}>
                  <Close className="h-9 w-9" />
                </button>
              </div>
              <h2 className="my-6 text-center text-2xl font-semibold text-gray-600">
                Filter Options
              </h2>
              <SortFilter
                onChange={onSortChangeHandler}
                onChangeColor={onSortChangeColorHandler}
                valueOption={sortOption}
              />
              <div className="flex w-full justify-center p-5">
                <button
                  onClick={filterToggleHandler}
                  className="btn w-full rounded-none shadow-sm"
                >
                  <div className="flex w-full items-center justify-center ">
                    <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                      close
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* any screen version */}
        <div className="hidden sm:block">
          <SortFilter
            onChange={onSortChangeHandler}
            onChangeColor={onSortChangeColorHandler}
            valueOption={sortOption}
          />
        </div>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div
          className={`flex-col items-center justify-center ${
            isFilterToggled ? 'hidden' : 'flex'
          }`}
        >
          <div className="container">
            {/* products rendering */}
            <div className="mb-7 mt-4 flex flex-col">
              <div className="relative mx-2 grid grid-cols-2 gap-2 gap-y-4 sm:grid-cols-3 sm:gap-4 sm:gap-y-10 lg:grid-cols-4 2xl:grid-cols-5">
                {isLoadingItems && (
                  <div className="absolute z-50 h-full w-full bg-gray-400 opacity-50">
                    <Spinner />
                  </div>
                )}
                {products &&
                  products.map((product, i) => (
                    <div key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  ))}
              </div>
            </div>

            {/* prodcts counter */}
            <div className="mt-20 flex justify-center">
              <div className="leading-0 mt-4 flex flex-col justify-center gap-2 font-smoochSans text-sm tracking-widest text-slate-900">
                <p>
                  You&apos;ve viewed {products.length} of {countSortOption}{' '}
                  products
                </p>
                <progress
                  className="progress progress-accent max-w-xs "
                  value={products.length}
                  max={countSortOption}
                ></progress>
                <button
                  onClick={loadMore}
                  className={`btn-md btn my-4 rounded-none shadow hover:btn-accent ${
                    isLoadingItems ? 'loading' : ''
                  } ${countSortOption === products.length ? 'invisible' : ''}`}
                >
                  {!isLoadingItems && (
                    <div className="flex w-full items-center justify-center ">
                      <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                        load more
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
