import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { v4 } from 'uuid';
import {
  addNewProductList,
  getCategoryCount,
  getProductListItemPreview,
} from '../../utils/firebase/firebase.category.utils';

import { ItemPreview } from '../../components/add-firebase/add-item.component';
import { popUpMessageContext } from '../navigation/navigation.component';

import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import { ReactComponent as AddIcon } from '../../assets/add_FILL0.svg';
import { ReactComponent as DoneIcon } from '../../assets/done_FILL0_.svg';

const ProductListAdmin = () => {
  const { setMessage } = useContext(popUpMessageContext);
  const [products, setProducts] = useState<ItemPreview[][]>([]);
  const [myProductList, setMyProductList] = useState<ItemPreview[]>([]);
  const [pagesNumber, setPagesNumber] = useState(0);
  const [page, setPage] = useState(1);
  const [listTitle, setListTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('initial');
  const navigate = useNavigate();

  async function fetchItemsSlice(page: number) {
    try {
      const slice = await getProductListItemPreview(page);
      if (slice) {
        setProducts((prevProducts) => {
          const newProducts = [...prevProducts];
          newProducts[page - 1] = slice;
          return newProducts;
        });
      }
    } catch (error) {
      console.log('error:', error);
    }
  }

  useEffect(() => {
    const fetchCategoryCount = async () => {
      try {
        const count = await getCategoryCount();
        const pageCount = Math.ceil(count / 2);
        setPagesNumber(pageCount);
      } catch (error) {
        console.log('error:', error);
      }
    };

    const fetchCount = fetchCategoryCount();
    const fetch = fetchItemsSlice(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addProductHandler = (product: ItemPreview) => {
    setMyProductList([...myProductList, product]);
  };
  const removeProductHandler = (productIdToRemove: string) => {
    setMyProductList((prevProductList) =>
      prevProductList.filter((product) => product.id !== productIdToRemove)
    );
  };

  const pageNextPreviousHandler = (page: number) => {
    if (page <= pagesNumber) {
      setPage(page);
      if (!products[page - 1] || products[page - 1].length === 0) {
        const fetchSlice = fetchItemsSlice(page);
      }
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setListTitle(e.target.value);
  };

  const createListHandler = () => {
    const addList = async (productList: string[]) => {
      setIsLoading(true);
      try {
        const add = await addNewProductList(productList, listTitle);
        setIsLoading(false);
        setMyProductList([]);
        setListTitle('');
        setError('');
        setMessage({ message: 'List added successfully.' });
      } catch (error) {
        return navigate('/error', { state: error as Error });
      }
    };

    if (listTitle && myProductList.length > 0) {
      const productList: string[] = [];
      myProductList.forEach((product) => productList.push(product.id));

      const add = addList(productList);
    } else {
      setError('you must provid title and products');
    }
  };
  return (
    <div className="flex h-full w-full justify-center gap-2 px-2">
      <div className="container flex h-full flex-col items-center">
        <h2 className="mb-6 text-center text-2xl font-semibold capitalize text-gray-600">
          product list
        </h2>
        {error && error !== 'initial' && (
          <div className="alert alert-error my-4 flex flex-col capitalize shadow-sm">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 flex-shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        <div className="mb-8 flex w-full justify-center">
          <input
            onChange={onChange}
            type="text"
            name="title"
            placeholder="Product List Name"
            className="input-bordered input w-full max-w-xs rounded-lg bg-white shadow-md"
            value={listTitle}
          />
        </div>
        {listTitle && (
          <>
            <div className="grid h-full w-full grid-cols-1 flex-col  gap-4 sm:flex-row lg:grid-cols-3">
              <div className="scrollbarStyle col-span-2 flex h-full w-full flex-col overflow-x-auto font-smoochSans text-sm tracking-wider text-slate-700 sm:h-fit sm:flex-1">
                <table className="table w-full">
                  {/* head */}
                  <thead className="p-4">
                    <tr className="w-full ">
                      <th className="flex w-full rounded-none bg-gray-100 pl-8">
                        Name
                      </th>
                      <th>category</th>
                      <th>colors</th>
                      <th className="rounded-none bg-gray-100 text-green-600">
                        add
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    {products[page - 1] &&
                      products[page - 1].map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div className="flex items-center space-x-3">
                              <div className="avatar max-h-40">
                                <img
                                  src={product.imagesUrls[0]}
                                  alt={product.imagesUrls[0]}
                                  className="max-h-40 w-full object-contain"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <span className="font-bold">
                                  {product.productName}
                                </span>
                                <div className="text-sm opacity-50">
                                  {product.created
                                    .toDate()
                                    .toLocaleDateString()}
                                </div>
                                <span className="flex w-52 whitespace-normal  text-sm opacity-50">
                                  {product.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-col gap-2 pl-2">
                              <div className="text-sm ">
                                {product.collectionKey}
                              </div>
                              <div className="text-sm ">{product.docKey}</div>
                            </div>
                          </td>
                          <td>
                            <div className="flex gap-2 pl-2 text-sm">
                              {product.colors.map((color) => (
                                <div
                                  key={color.label}
                                  className={`${color.value} h-5 w-5 rounded-sm`}
                                ></div>
                              ))}
                            </div>
                          </td>
                          <th>
                            <button
                              disabled={myProductList.some(
                                (item) => item.id === product.id
                              )}
                              onClick={() => {
                                addProductHandler(product);
                              }}
                              className="btn-xs btn h-full rounded-none shadow-sm disabled:bg-green-400"
                            >
                              <div className="flex h-full  items-center justify-center  disabled:hidden">
                                <span className="py-2 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                                  {myProductList.some(
                                    (item) => item.id === product.id
                                  ) ? (
                                    <DoneIcon className="h-6 w-6" />
                                  ) : (
                                    <AddIcon />
                                  )}
                                </span>
                              </div>
                            </button>
                          </th>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="col-span-1 flex w-full flex-col items-center">
                <div className="scrollbarStyle max-h-2/3 mb-6 flex h-fit w-full max-w-md flex-col  items-center overflow-auto bg-gray-100 p-2">
                  <span className="w-full p-[6px] text-center  font-smoochSans text-sm font-bold uppercase tracking-wider text-slate-700">
                    {listTitle}
                  </span>
                  {myProductList.map((product) => (
                    <div key={`${product}List${v4()}`} className="p-2">
                      <div className="flex items-center space-x-3">
                        <div className="avatar max-h-40">
                          <img
                            src={product.imagesUrls[0]}
                            alt={product.imagesUrls[0]}
                            className="max-h-28 w-full object-contain"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="font-bold">
                            {product.productName}
                          </span>
                          <span className="flex w-52 whitespace-normal  text-sm opacity-50">
                            {product.id}
                          </span>
                        </div>
                        <div className="flex h-full w-20 flex-col">
                          {' '}
                          <button
                            onClick={() => removeProductHandler(product.id)}
                            type="button"
                            className="flex w-7"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={createListHandler}
                    className={`${
                      isLoading ? 'loading' : ''
                    } btn m-4 h-fit w-2/3 rounded-none shadow-sm`}
                  >
                    <div
                      className={`${
                        isLoading ? 'hidden' : 'block'
                      } flex h-full w-full items-center justify-center `}
                    >
                      <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                        create
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            {/* pages buttons */}
            <div className="join mb-28 flex justify-center">
              {[...Array(pagesNumber)].map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => pageNextPreviousHandler(pageNumber)}
                    className={`join-item btn rounded-none ${
                      page === pageNumber ? 'btn-active' : ''
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListAdmin;
