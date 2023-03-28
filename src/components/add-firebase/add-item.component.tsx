import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  ChangeEvent, memo, useCallback, useEffect, useReducer, useRef, useState, 
} from 'react';
import { Action, AnyAction } from 'redux';
import { v4 } from 'uuid';
import * as slugFunciton from 'slug';

import { storageFB } from '../../utils/firebase/firebase.utils';
import { ActionWithPayload, createAction, withMatcher } from '../../utils/reducer/reducer.utils';

import FormInput from '../input-form/input-form.component';
import SelectColor, { SelectColorOption } from '../select-color/select-color.component';
import Select, { SelectOption } from '../select/select.component';
import UploadInput, { ImageColorsFiles } from '../upload-input/upload-input.component';
import { AddItemStock, SizeStock } from './add-item-stock.component';


// ACTION AND TYPES
export enum UPLOADIMG_ACTION_TYPES {
  FETCH_UPLOADING_START = 'uploadImage/FETCH_UPLOADING_START',
  FETCH_MOUNTED = 'uploadImage/FETCH_MOUNTED',
  FETCH_UPLOADING_SUCCESS = 'uploadImage/FETCH_UPLOADING_SUCCESS',
  FETCH_UPLOADING_FAILED = 'uploadImage/FETCH_UPLOADING_FAILED',
}

export type FeatchMounted = ActionWithPayload<UPLOADIMG_ACTION_TYPES.FETCH_MOUNTED, boolean>;

export type FeatchUploadImageStart = Action<UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_START>;

export type FeatchUploadImageSuccess = ActionWithPayload<UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_SUCCESS, string[]>;

export type FeatchUploadImageFailed = ActionWithPayload<UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_FAILED, Error>;

export const featchMounted = withMatcher(
  (isMounted: boolean): FeatchMounted => createAction(UPLOADIMG_ACTION_TYPES.FETCH_MOUNTED, isMounted),
);

export const featchUploadImageStart = withMatcher(
  (): FeatchUploadImageStart => createAction(UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_START),
);

export const featchUploadImageSuccess = withMatcher(
  (imgUrlList: string[]): FeatchUploadImageSuccess => createAction(UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_SUCCESS, imgUrlList),
);

export const featchUploadImageFailed = withMatcher(
  (error: Error): FeatchUploadImageFailed => createAction(UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_FAILED, error),
);

type AddItemState = {
  isLoading: boolean
  mounted: boolean
  isImageUploadDone: boolean
  error: Error | null,
};
export const ADDITEM_INITIAL_STATE: AddItemState = {
  isLoading: false,
  mounted: false,
  isImageUploadDone: false,
  error: null,
};

// REDUCER
export const AddItemReducer = (
  state = ADDITEM_INITIAL_STATE,
  action: AnyAction,
): AddItemState => {
  if (featchMounted.match(action)) {
    return { ...state, mounted: action.payload };
  }

  if (featchUploadImageStart.match(action)) {
    return {
      ...state, isLoading: true, isImageUploadDone: false, 
    };
  }

  if (featchUploadImageSuccess.match(action)) {
    return {
      ...state, isLoading: false, isImageUploadDone: true, mounted: false,
    };
  }

  if (featchUploadImageFailed.match(action)) {
    return { ...state, error: action.payload, isLoading: false };
  }

  return state;
};


// select options
const optionsShoes: SelectOption[] = [
  { label: '36', value: '36' },
  { label: '37', value: '37' },
  { label: '38', value: '38' },
  { label: '39', value: '39' },
  { label: '40', value: '40' },
  { label: '41', value: '41' },
  { label: '42', value: '42' },
  { label: '43', value: '43' },
];
const optionsClothes: SelectOption[] = [
  { label: 'y-6', value: 'y-6' },
  { label: 'y-7', value: 'y-7' },
  { label: 'y-8', value: 'y-8' },
  { label: 'y-9', value: 'y-9' },
  { label: 'y-10', value: 'y-10' },
  { label: 'y-11', value: 'y-11' },
  { label: 'y-12', value: 'y-12' },
];
const optionsGlobal: SelectOption[] = [
  { label: 'xs', value: 'XS' },
  { label: 's', value: 'S' },
  { label: 'm', value: 'M' },
  { label: 'l', value: 'L' },
  { label: 'xl', value: 'XL' },
  { label: 'XXL', value: 'XXL' },
];
const optionsColors: SelectColorOption[] = [
  { label: 'sky', value: 'bg-sky-500' },
  { label: 'slate', value: 'bg-slate-500' },
  { label: 'gray', value: 'bg-gray-500' },
  { label: 'zinc', value: 'bg-zinc-500' },
  { label: 'red', value: 'bg-red-500' },
  { label: 'green', value: 'bg-green-500' },
  { label: 'yellow', value: 'bg-yellow-500' },
  { label: 'blue', value: 'bg-blue-500' },
  { label: 'nocolor', value: 'bg-white' },
];

export type ColorImages = {
  itemUrlList: string[]
  color: string
};

export type NewItemValues = {
  id: string
  created: string
  productName: string
  slug: string
  price: number
  colors: SelectColorOption[]
  sizes: SelectOption[]
  colorImagesUrls: ColorImages[]
  imgFileList: ImageColorsFiles[]
  stock: SizeStock[]
  details: string
};

type AddItemError = {
  key: string
  message: string
};

type AddItemProps = {
  onAddItem: (newItem: NewItemValues) => void;
};

const defualtItemValues: NewItemValues = {
  id: '',
  // eslint-disable-next-line newline-per-chained-call
  created: (new Date().toLocaleString().slice(0, 10).replace(/-/g, '-').replace(',', '').split('-').reverse().join('/')),
  productName: '',
  slug: '',
  price: 0,
  colors: [],
  sizes: [],
  colorImagesUrls: [],
  imgFileList: [],
  stock: [],
  details: '',
};

export const AddItem = ({ onAddItem }: AddItemProps) => {
  const [addItemValues, setAddItemValues] = useState<NewItemValues>(defualtItemValues);
  const [isError, setIsError] = useState<AddItemError[]>([]);
  const [addItemReducer, dispatch] = useReducer(AddItemReducer, ADDITEM_INITIAL_STATE);
  const {
    mounted, isImageUploadDone, isLoading, 
  } = addItemReducer;

  const {
    colors, sizes, imgFileList, price, productName, 
  } = addItemValues;
  // this two state hadling the types we have of select option like (global:s,m,l.. shoes:40,41,42..)
  const [isSelectTypeOption, setIsSelectTypeOption] = useState('');
  const [selectedTypeOption, setSelectedTypeOption] = useState<SelectOption[]>([]);
  // useRef to reset the productName and price after reset values;
  const productNameRef = useRef<HTMLInputElement>();
  const priceRef = useRef<HTMLInputElement>();
  const detailsRef = useRef<HTMLTextAreaElement>(null);

  // image upload functions
  const UploadAsync = useCallback(async (imgFileList: ImageColorsFiles) => {
    // dispatch(featchUploadImageStart());
    // check if the color exsist when adding more colors after the first time
    if (addItemValues.colorImagesUrls.some((colorImg) => colorImg.color === imgFileList.color)) {
      return;
    }
    const urlList:string[] = [];
    try {
      const promises = imgFileList.files.map(async (file) => {
        const imageRef = ref(storageFB, `images/${file.name + v4()}`);
        const snapshot = await uploadBytes(imageRef, file);
        return await getDownloadURL(snapshot.ref);
      });
  
      const urlArray = await Promise.all(promises);
  
      urlArray.forEach((url) => {
        urlList.push(url);
      });
      // Update the state here after all uploads are complete
      // create an obj type to pass
      // const colorImages:ColorImages = {
      //   itemUrlList: urlList,
      //   color: colorLabel,
      // }; 
      const colorImages: ColorImages = {
        itemUrlList: urlList,
        color: imgFileList.color,
      };
      setAddItemValues((prevState) => { return { ...prevState, colorImagesUrls: [...prevState.colorImagesUrls, colorImages], imgFileList: [] }; });
    } catch (error: any) {
      dispatch(featchUploadImageFailed(error));
    }
  }, [addItemValues, dispatch]);
  
  const imageUploadAsync = async () => {
    dispatch(featchUploadImageStart);
    const uploadPromises = imgFileList.map((fileList) => {
      return UploadAsync(fileList);
    });
    const responses = await Promise.all(uploadPromises);
    dispatch(featchUploadImageSuccess);
  };

  // error checker before submit
  function errorChecker() {
    if (mounted === false) {
      dispatch(featchMounted(true));
    }
    const newErrors: AddItemError[] = []; 

    if (Array.isArray(imgFileList) && imgFileList.length !== colors.length) {
      newErrors.push({ key: 'imgFileList', message: 'Upload image for the choosen color' });
    }
    if (Array.isArray(sizes) && sizes.length === 0) {
      newErrors.push({ key: 'sizes', message: 'Size must be choose' });
    }
    if (Array.isArray(colors) && colors.length === 0) {
      newErrors.push({ key: 'colors', message: 'Color must be choose or no-color option' });
    }
    if (price === 0) {
      newErrors.push({ key: 'price', message: 'You must enter product price' });
    }
    if (productName === '') {
      newErrors.push({ key: 'productName', message: 'You must enter product name' });
    }
    setIsError(newErrors);
  }

  // listen to selectTypeOption and sent the new option to select
  useEffect(() => {
    if (isSelectTypeOption === 'global') {
      setSelectedTypeOption([...optionsGlobal]);
    }
    if (isSelectTypeOption === 'clothes') {
      setSelectedTypeOption([...optionsClothes]);
    } 
    if (isSelectTypeOption === 'shoes') {
      setSelectedTypeOption([...optionsShoes]);
    }
  }, [isSelectTypeOption]);

  // mounted is used to prevent this useEffect run on initial load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { mounted && errorChecker(); }, [addItemValues]);

  // useEffect for passing the newItem to parent component AddFirebase also reset form fields
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isLoading === false && isImageUploadDone === true) {
      onAddItem(addItemValues); 
      if (productNameRef.current !== null && productNameRef.current !== undefined) {
        productNameRef.current.value = '';
      }
      if (priceRef.current !== null && priceRef.current !== undefined) {
        priceRef.current.value = '';
      }
      if (detailsRef.current !== null && detailsRef.current !== undefined) {
        detailsRef.current.value = '';
      }
      setAddItemValues(defualtItemValues);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImageUploadDone]);
  
  // listen to colors for changes for removing the uploaded images
  useEffect(() => {
    setAddItemValues((prevState) => ({
      ...prevState,
      imgFileList: prevState.imgFileList.filter((item) => colors.some((color) => color.label === item.color)),
    }));
  }, [colors]);

  
  const addItemHandler = () => {
    setAddItemValues((prevState) => ({ ...prevState, id: `${prevState.productName + v4()}` }));
    setAddItemValues((prevState) => ({ ...prevState, slug: slugFunciton(addItemValues.productName) }));
    errorChecker();
  };

  const AddItemAsync = () => {
    if (isError.length === 0 && mounted) {
      dispatch(featchMounted(false));
      imageUploadAsync();
    }
  };

  // useEffect for reset mounted after checkError been called its prevent the component to add item after all errors solved
  // this useEffect fix the "click twice the button"
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (mounted && isError.length > 0) {
      dispatch(featchMounted(false));
    }
    if (mounted && isError.length === 0) {
      AddItemAsync();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, mounted]);
  
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddItemValues({ ...addItemValues, [e.target.name]: e.target.value });
  };

  // prevent input number to except the following chars
  const exceptThisSymbols = ['e', 'E', '+', '-', '.'];
  return (
    <div className="flex flex-col">
      {/* title */}
      <div className="flex justify-center text-xl mb-2 text-gray-800  font-semibold">New Item</div>
      {/* error handling */}
      {isError.length > 0 && (
        <div className="flex flex-col">
          <div className="alert alert-warning bg-yellow-200 shadow-lg flex flex-col my-2">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>Warning: Invalid the following inputs</span>
            </div>
            <div className="flex flex-wrap">

              {isError.map((error) => {
                return (
                  <span className="text-red-600  flex" key={`${error.key}error`}>
                    <div className="flex justify-center items-center pt-2 p-1">
                      <div className="rounded-full w-1 h-1 bg-black opacity-50"></div>
                    </div>
                    {`${error.key}: ${error.message}`}
                  </span>
                ); 
              })}
            </div>
          </div>     
        </div>
      )}

      {/* FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* FORM INPUTS */}
        <div className="flex justify-center  bg-gray-100 mb-2 mx-1 p-2 rounded-lg shadow-md">
          <div className="flex flex-col w-80">
            <div className="w-full max-w-xs">
              <label className="pb-1">
                <span className="label-text">Product Name</span>
              </label>
              <FormInput type="text" ref={productNameRef} name="productName" placeholder="Product Name" label="Product Name" pattern="^[A-Za-z0-9]{3,50}$" onChange={onChange} required errorMessage="Enter product name" />
            </div>
            <div className="w-full max-w-xs">
              <label className="label pb-1">
                <span className="label-text">Price</span>
              </label>
              <FormInput ref={priceRef} onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()} type="number" name="price" placeholder="Price" label="Price" min="0" onChange={onChange} required errorMessage="Price can't be 0" />
            </div>
            <div className="w-full max-w-xs">
              <label className="label pb-1">
                <span className="label-text">Size types options</span>
              </label>
              <div className="btn-group flex justify-center">
                <button onClick={(e) => { e.preventDefault(); setIsSelectTypeOption('global'); }} type="button" name="global" className={`btn btn-sm btn-accent border-0 text-gray-600 shadow-md ${isSelectTypeOption === 'global' ? 'bg-accent' : 'bg-gray-300'}`}>global</button>
                <button onClick={(e) => { e.preventDefault(); setIsSelectTypeOption('clothes'); }} type="button" name="clothes" className={`btn btn-sm btn-accent border-0 text-gray-600 shadow-md ${isSelectTypeOption === 'clothes' ? 'bg-accent' : 'bg-gray-300'}`}>clothes</button>
                <button onClick={(e) => { e.preventDefault(); setIsSelectTypeOption('shoes'); }} type="button" name="shoes" className={`btn btn-sm btn-accent border-0 text-gray-600 shadow-md ${isSelectTypeOption === 'shoes' ? 'bg-accent' : 'bg-gray-300'}`}>shoes</button>
              </div>
            </div>
            <div className="w-full max-w-xs">
              <label className="label pb-1">
                <span className="label-text">Size</span>
              </label>
              <div className="relative">
                <Select multiple firstOption={{ label: 'Select Size', value: '' }} options={selectedTypeOption} onChange={(objSizes) => { setAddItemValues({ ...addItemValues, sizes: objSizes }); }} value={sizes} />
                {isSelectTypeOption === '' && <div className="absolute top-0 bg-black w-full h-full cursor-not-allowed opacity-20 rounded-lg"></div>}
              </div>
            </div>
            <div className="w-full max-w-xs">
              <label className="label pb-1">
                <span className="label-text">Color</span>
              </label>
              <SelectColor firstOption={{ label: 'Select Color', value: '' }} options={optionsColors} onChange={(objColors) => { setAddItemValues({ ...addItemValues, colors: objColors }); }} value={colors} />
            </div>
            <div className="w-full max-w-xs">
              <label className="label pb-1">
                <span className="label-text">Details</span>
              </label>
              <textarea ref={detailsRef} placeholder="Item details" className="textarea textarea-bordered textarea-sm w-full max-w-xs leading-5 text-base h-32" onChange={(e) => { setAddItemValues({ ...addItemValues, details: e.target.value }); }}></textarea>
            </div>
          </div>
        </div>

        {/* IMAGES */}
        {(Array.isArray(addItemValues.colors) && addItemValues.colors.length !== 0) 
          && (
            <div className="flex justify-center col-span-3 p-2 mx-1 lg:col-span-2 bg-gray-100 rounded-lg shadow-md">
              <div className="flex flex-col">
                <label className="flex p-0 m-0 justify-center">
                  <span className="label-text">Images</span>
                </label>          
                <div className="flex flex-wrap justify-center gap-2 gap-y-1">
                  {
                  colors.map((color) => {
                    return (
                      color.label === 'nocolor' ? (
                        <div key={color.label} className="p-2 mt-2 shadow-lg rounded-lg max-w-xs">
                          <UploadInput
                            colorLabel={color.label}
                            onChange={(colorImages) => { 
                              setAddItemValues((addItemValues) => ({ ...addItemValues, colorImagesUrls: [...addItemValues.colorImagesUrls, colorImages] })); 
                            }}
                            onChangeFiles={(imgColors) => { 
                              const updatedStock = [...addItemValues.imgFileList];
                              updatedStock.push(imgColors);
                              setAddItemValues((prevState) => ({ ...prevState, imgFileList: updatedStock })); 
                            }}
                          />
                        </div>
                      ) : (      
                        <div key={color.label} className={`${color.value} p-1 mt-1 shadow-lg rounded-lg max-w-xs`}>
                          <UploadInput
                            colorLabel={color.label}
                            onChange={(colorImages) => { 
                              setAddItemValues((addItemValues) => ({ ...addItemValues, colorImagesUrls: [...addItemValues.colorImagesUrls, colorImages] })); 
                            }}
                            onChangeFiles={(imgColors) => { 
                              const updatedStock = [...addItemValues.imgFileList];
                              updatedStock.push(imgColors);
                              setAddItemValues((prevState) => ({ ...prevState, imgFileList: updatedStock }));  
                            }}
                          />
                        </div>
                      )
                    );
                  })
                }
                </div>
              </div>
            </div>
          )}

        {/* STOCK COMPONENT */}
        {(Array.isArray(addItemValues.sizes) && addItemValues.sizes.length !== 0) 
              && (Array.isArray(addItemValues.colors) && addItemValues.colors.length !== 0)
              && (
                <div className="flex justify-center col-span-3 py-2 bg-gray-100 rounded-lg shadow-md">
                  <div className="flex flex-col">
                    <label className="label justify-center p-0 m-0">
                      <span className="label-text">Stock</span>
                    </label>
                    <AddItemStock
                      onChange={(ItemStock) => { 
                        setAddItemValues(() => ({ ...addItemValues, stock: ItemStock })); 
                      }}
                      colors={colors}
                      sizes={sizes}
                    />
                  </div>
                </div>
              )}

        <div className="md:col-span-3 flex flex-col w-full pb-2">
          <div className="border-t border-gray-700 m-4 opacity-30"></div>
          <div className="flex justify-end">
            <button type="button" className={`btn btn-accent ${isLoading ? 'loading' : ''} mx-4 btn-sm text-gray-700`} onClick={addItemHandler}>Create Item</button>
          </div>
        </div>
          
      </div>
      
    </div>
  );
};

export default memo(AddItem);
