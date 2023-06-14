import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getProductList } from '../../utils/firebase/firebase.category.utils';

import { ReactComponent as Close } from '../../assets/close_FILL0.svg';
import { ReactComponent as SortIcon } from '../../assets/sort_FILL0_wght200.svg';

import { ItemPreview } from '../../components/add-firebase/add-item.component';
import ProductCard from '../../components/product-card/product-card.component';
import Spinner from '../../components/spinner/spinner.component';
import { SortOption } from '../category/category.component';
import SortFilter from '../../components/sort-filter/sort-filter.component';
import { SelectOption } from '../../components/select/select.component';

const ProductList = () => {
  const location = useLocation();
  const [products, setProducts] = useState<ItemPreview[]>([]);
  const [productsRender, setProductsRender] = useState<ItemPreview[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [productListName, setProductListName] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>({
    sort: { label: 'Sort', value: '' },
    colors: [],
    sizes: [],
  });
  const [isFilterToggled, setIsFilterToggled] = useState(false);

  function sortByValue(itemSortBy: ItemPreview[]) {
    if (sortOption.sort.value === 'recommended') {
      itemSortBy.sort((a, b) => a.created.toMillis() - b.created.toMillis());
    }
    if (sortOption.sort.value === 'new') {
      itemSortBy.sort((a, b) => b.created.toMillis() - a.created.toMillis());
    }
    if (sortOption.sort.value === 'price-low') {
      itemSortBy.sort((a, b) => a.price - b.price);
    }
    if (sortOption.sort.value === 'price-high') {
      itemSortBy.sort((a, b) => b.price - a.price);
    }
    return itemSortBy;
  }

  const sortFunction = () => {
    let newProducts: ItemPreview[] = products;
    if (
      sortOption.sort.value === '' &&
      sortOption.colors.length === 0 &&
      sortOption.sizes.length === 0
    ) {
      return newProducts;
    }
    sortByValue(newProducts);
    if (sortOption.colors.length > 0) {
      const newSort = newProducts
        .filter((item) =>
          item.colorsSort.some((color) =>
            sortOption.colors.some((sortColor) => color === sortColor.label)
          )
        )
        .filter((item) =>
          newProducts.some((newItem) => newItem.id === item.id)
        );
      newProducts = [...newSort];
    }
    if (sortOption.sizes.length > 0) {
      if (sortOption.colors.length > 0) {
        const newSort = newProducts
          .filter((item) =>
            item.sizesSort.some((size) =>
              sortOption.sizes.some((stateSort) => size === stateSort.value)
            )
          )
          .filter((item) =>
            newProducts.some((newItem) => newItem.id === item.id)
          )
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
        newProducts = [...newSort];
      }
      const newSort = newProducts
        .filter((item) =>
          item.sizesSort.some((size) =>
            sortOption.sizes.some((stateSort) => size === stateSort.value)
          )
        )
        .filter((item) =>
          newProducts.some((newItem) => newItem.id === item.id)
        );
      newProducts = [...newSort];
    }
    return newProducts;
  };
  useEffect(() => {
    const fetchItems = async () => {
      const listName = location.pathname.split('/').slice(-1).join('');
      try {
        const listProducts = await getProductList(listName);
        setProducts(listProducts);
        setProductsRender(listProducts);
        setProductListName(listName);
      } catch (error) {
        console.log('error:', error);
      }
    };
    const fetch = fetchItems();
  }, [location.pathname]);

  useEffect(() => {
    setIsLoadingItems(true);
    const res = sortFunction();
    res !== undefined && setProductsRender([...res]);
    setIsLoadingItems(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);

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
    <div className="h-full w-full bg-white">
      {/* title */}
      <h2 className="mb-6 text-center text-2xl font-semibold capitalize text-gray-600">
        {productListName}
      </h2>
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
          className={`absolute inset-0 z-[100] h-screen w-full bg-white ${
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
      <div className={`flex-col items-center justify-center `}>
        <div className="container">
          {isLoadingItems ? (
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
                    {productsRender &&
                      productsRender.map((product, i) => (
                        <div key={product.id}>
                          <ProductCard product={product} />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
