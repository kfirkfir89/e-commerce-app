import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CategoryRouteParams } from '../category/category.component';
import { NewItemValues } from '../../components/add-firebase/add-item.component';
import { getItemFromRoute } from '../../utils/firebase/firebase.utils';

import { ReactComponent as ArrowBack } from '../../assets/arrow_back.svg';
import { ReactComponent as ArrowForward } from '../../assets/arrow_forward.svg';
import { ReactComponent as ShoppingIcon } from '../../assets/local_mall.svg';

import { SelectOption } from '../../components/sort-select/sort-select.component';
import SizeProductSelect from '../../components/size-product-select/size-product-select.component';
import Spinner from '../../components/spinner/spinner.component';
import { setCartItems } from '../../store/cart/cart.action';
import { CartItemPreview } from '../../store/cart/cart.types';
import { selectCartItems } from '../../store/cart/cart.selector';

const ItemPreview = () => {
  const { subCategoryPara, shopPara } = useParams<keyof CategoryRouteParams>() as CategoryRouteParams;
  
  const [product, setProduct] = useState<NewItemValues | undefined>();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeOption, setSelectedSizeOption] = useState<SelectOption>({ label: '', value: '' });

  const [imagesUrlList, setImagesUrlList] = useState<string[]>([]);
  const [addToCartQuantity, setAddToCartQuantity] = useState(0);

  const [sizeError, setSizeError] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  
  const cartItemsSelector = useSelector(selectCartItems);

  const dispatch = useDispatch();
  const location = useLocation();
  const productId = location.state as string;

  // set image array to manipulate the images view
  useEffect(() => {
    if (product) {
      const { colorImagesUrls }: NewItemValues = product;
      setImagesUrlList(colorImagesUrls[selectedColorIndex].itemUrlList);
    }
  }, [product, selectedColorIndex]);

  // geting the item by id
  const fetchItem = async () => {
    try {
      const resProduct = await getItemFromRoute(shopPara, subCategoryPara, productId);
      if (resProduct !== undefined) {
        setProduct(resProduct);
        
        // check if item exsist in cart with the chossen color to get quantity
        if (cartItemsSelector.some((cartItem) => cartItem.id === resProduct.id && cartItem.color === resProduct.colorImagesUrls[selectedColorIndex].color)) {
          const item = cartItemsSelector.find((cartItem) => cartItem.id === resProduct.id && cartItem.color === resProduct.colorImagesUrls[selectedColorIndex].color);
          if (item !== undefined) {
            setAddToCartQuantity(item.quantity);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching item:', error);
    }
  };
  
  // fetch the product 
  useEffect(() => {
    if (productId) {
      const res = fetchItem().then(() => setIsLoadingPage(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // hidden the error
  useEffect(() => {
    setSizeError(false);
  }, [selectedSizeOption]);

  // image next/prev image
  const handlePreviousClick = () => {
    setSelectedImageIndex(selectedImageIndex === 0 ? imagesUrlList.length - 1 : selectedImageIndex - 1);
  };
  const handleNextClick = () => {
    setSelectedImageIndex(selectedImageIndex === imagesUrlList.length - 1 ? 0 : selectedImageIndex + 1);
  };

  // set the chossen size
  const onChangeSize = (size: SelectOption | undefined) => {
    if (size !== undefined) {
      setSelectedSizeOption(size);
    }
  };

  // set item cart quantity button display
  const selectColor = (i: number) => {
    setSelectedColorIndex(i);
    if (product) {
      const item = cartItemsSelector.find((cartItem) => cartItem.colorId === (`${product.id + product.colorImagesUrls[selectedColorIndex].color}`));
      if (item) {
        setAddToCartQuantity(item.quantity);
      } else {
        setAddToCartQuantity(0);
      }
    }
  };

  // button handler add item to bag
  const addToCartHandler = () => {
    if (selectedSizeOption.value === '') {
      setSizeError(true);
      return;
    }
    setAddToCartQuantity((prev) => prev + 1);

    if (product) {
      const newCartItem: CartItemPreview = {
        id: product.id,
        colorId: product.id + product.colors[selectedColorIndex].label,
        productName: product.productName,
        price: product.price,
        color: product.colors[selectedColorIndex].label,
        size: selectedSizeOption.label,
        previewImage: imagesUrlList[0],
        quantity: addToCartQuantity + 1,
      };

      dispatch(setCartItems([newCartItem]));
    }
  };

  return (
    <div>
      { isLoadingPage ? (
        <Spinner />
      ) : (
        <div className="flex justify-center">
          {
            product
            && (
              <div className="container ">
    
                <div className="flex-col mx-2">
                  <div className="flex flex-col">
                    <section className="py-3 sm:py-5">
                      <div className="grid sm:grid-cols-2 gap-10">
    
                        {/* item images */}
                        <div className="flex-col justify-self-end max-w-xl p-2">
                          <div className="flex mb-2 relative">
                            <div className="flex w-full h-full absolute z-50">
                              <div className="flex w-full mx-2 items-center">
                                <div className="flex-1">
                                  <button className="font-extrabold" onClick={handlePreviousClick}>
                                    <ArrowBack className="w-7 text-gray-400 opacity-80" />
                                  </button>
                                </div>
                                <div className="flex-none">
                                  <button onClick={handleNextClick}>
                                    <ArrowForward className="w-7 text-gray-400 opacity-80" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <img src={imagesUrlList[selectedImageIndex]} alt="" className="shadow-sm" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {product.colorImagesUrls[selectedColorIndex].itemUrlList.map((imgUrl, i) => ((
                              <button key={imgUrl} className={`shadow-sm ${i !== selectedImageIndex ? 'block' : 'hidden'}`} onClick={() => { setSelectedImageIndex(i); }}>
                                <img src={imgUrl} alt="" />
                              </button>
                            )
                            ))}
                          </div>
                        </div>
    
                        {/* item details */}
                        <div className="flex flex-col gap-y-3 px-5 p-2 max-w-lg">
                          <div className="text-2xl font-dosis font-semibold tracking-widest hover:text-slate-600 ">
                            {product.productName}
                          </div>
                          <div className="text-2xl font-dosis font-semibold tracking-widest hover:text-slate-600 ">
                            $
                            {product.price}
                          </div>
    
                          {/* colors options */}
                          <figure className="flex flex-col my-4">
                            <span className="label-text tracking-wider hover:text-slate-600">Colors</span>
                            <div className="flex flex-wrap rounded-lg">
                              {product.colorImagesUrls.map((colorOption, i) => (
                                <button onClick={() => selectColor(i)} className="mx-1 bg-transparent" key={colorOption.color}>
                                  <div>
                                    <div className={`h-32 min-h-max m-1 p-1 ${selectedColorIndex === i ? 'outline-dashed outline-[1px] outline-slate-700' : ''} carousel carousel-vertical rounded-lg shadow-sm ${product.colors.find((color) => color.label === colorOption.color)?.value}`}>
                                      {
                                      colorOption.itemUrlList.map((img) => {
                                        return (
                                          <div key={img} className="carousel-item justify-center h-34">
                                            <img className="h-32" src={img} alt={img} />
                                          </div>
                                        );
                                      })
                                    }
                                    </div>
    
                                  </div>
                                </button>
                              ))}
    
                            </div>
                          </figure>
    
                          {/* select size */}
                          <span className="label-text tracking-wider hover:text-slate-600">Size</span>
                          <div className="mx-2 w-full z-50">
                            <SizeProductSelect 
                              productStock={product.stock}
                              productColor={product.colors[selectedColorIndex]}
                              firstOption={{ label: 'Select Size', value: '' }}
                              options={product.sizes}
                              onChange={(o: SelectOption | undefined) => { onChangeSize(o); }}
                              value={selectedSizeOption}
                            />
                            {
                              sizeError && <span className="font-smoochSans font-semibold text-xs tracking-widest text-red-500 px-2">size must be selected</span>
                            }
                          </div>
    
                          {/* add button */}
                          <div className="m-2 w-full z-40">
                            <button
                              onClick={addToCartHandler}
                              className="btn rounded-none w-full shadow-sm "
                            >
                              <div className="w-full flex justify-center items-center ">
                                <label className="px-1 cursor-pointer">
                                  <div className="relative">
                                    <div className="relative flex items-center justify-center">
                                      <ShoppingIcon />
                                      <span className="absolute text-[10px] sm:text-xs font-bold pt-2">{addToCartQuantity > 0 && addToCartQuantity}</span>
                                    </div>
                                  </div>
                                </label>
                                <span className="uppercase flex pt-1 font-smoochSans font-semibold text-xs tracking-widest">
                                  Add To Bag
                                </span>
                              </div>
                            </button>
                          </div>
                          
    
                          {/* <button
                            className={`btn btn-ghost btn-sm my-4 hover:btn-accent ${isLoadingItems ? 'loading' : ''} ${countSortOption === products.length ? 'invisible' : ''}`}
                          >
                            load more
                          </button> */}
                          {/* details size */}
                          <span className="label-text tracking-wider hover:text-slate-600 mt-4">Details</span>
                          <div className="flex mx-2 flex-col bg-gray-100 p-2 w-full rounded shadow-sm">
                            <span className="">
                              {product.details}
                            </span>       
                          </div>
                        </div>
    
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            )
          }
        </div>

      )}
    </div>
  );
};

export default ItemPreview;
