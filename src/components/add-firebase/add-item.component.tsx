import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Action, AnyAction } from 'redux';
import { v4 } from 'uuid';
// import * as slugFunciton from 'slug';
import slug from 'slug';

import { Timestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { storageFB } from '../../utils/firebase/firebase.utils';
import {
  ActionWithPayload,
  createAction,
  withMatcher,
} from '../../utils/reducer/reducer.utils';

import SelectColor, {
  SelectColorOption,
} from '../select-color/select-color.component';
import Select, { SelectOption } from '../select/select.component';
import UploadInput, {
  ImageColorsFiles,
} from '../upload-input/upload-input.component';
import { AddItemStock, SizeStock } from './add-item-stock.component';
import { selectAddFirebaseReducer } from '../../store/add-firebase/add-firebase.reducer';

// ACTION AND TYPES
export enum UPLOADIMG_ACTION_TYPES {
  FETCH_UPLOADING_START = 'uploadImage/FETCH_UPLOADING_START',
  FETCH_MOUNTED = 'uploadImage/FETCH_MOUNTED',
  FETCH_UPLOADING_SUCCESS = 'uploadImage/FETCH_UPLOADING_SUCCESS',
  FETCH_UPLOADING_FAILED = 'uploadImage/FETCH_UPLOADING_FAILED',
}

export type FeatchMounted = ActionWithPayload<
  UPLOADIMG_ACTION_TYPES.FETCH_MOUNTED,
  boolean
>;

export type FeatchUploadImageStart =
  Action<UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_START>;

export type FeatchUploadImageSuccess = ActionWithPayload<
  UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_SUCCESS,
  string[]
>;

export type FeatchUploadImageFailed = ActionWithPayload<
  UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_FAILED,
  Error
>;

export const featchMounted = withMatcher(
  (isMounted: boolean): FeatchMounted =>
    createAction(UPLOADIMG_ACTION_TYPES.FETCH_MOUNTED, isMounted)
);

export const featchUploadImageStart = withMatcher(
  (): FeatchUploadImageStart =>
    createAction(UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_START)
);

export const featchUploadImageSuccess = withMatcher(
  (imgUrlList: string[]): FeatchUploadImageSuccess =>
    createAction(UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_SUCCESS, imgUrlList)
);

export const featchUploadImageFailed = withMatcher(
  (error: Error): FeatchUploadImageFailed =>
    createAction(UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_FAILED, error)
);

type AddItemState = {
  isLoading: boolean;
  mounted: boolean;
  isImageUploadDone: boolean;
  error: Error | null;
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
  action: AnyAction
): AddItemState => {
  if (featchMounted.match(action)) {
    return { ...state, mounted: action.payload };
  }

  if (featchUploadImageStart.match(action)) {
    return {
      ...state,
      isLoading: true,
      isImageUploadDone: false,
    };
  }

  if (featchUploadImageSuccess.match(action)) {
    return {
      ...state,
      isLoading: false,
      isImageUploadDone: true,
      mounted: false,
    };
  }

  if (featchUploadImageFailed.match(action)) {
    return { ...state, error: action.payload, isLoading: false };
  }

  return state;
};

export const optionsShirts: SelectOption[] = [
  { label: '2-3 Years', value: '2-3' },
  { label: '3-4 Years', value: '3-4' },
  { label: '4-5 Years', value: '4-5' },
  { label: '5-6 Years', value: '5-6' },
  { label: '6-7 Years', value: '6-7' },
  { label: '7-8 Years', value: '7-8' },
  { label: '8-9 Years', value: '8-9' },
  { label: '9-10 Years', value: '9-10' },
  { label: '10-11 Years', value: '10-11' },
  { label: '11-12 Years', value: '11-12' },
  { label: '12-13 Years', value: '12-13' },
  { label: '13-14 Years', value: '13-14' },
  { label: '14-15 Years', value: '14-15' },
  { label: '15-16 Years', value: '15-16' },
  { label: 'XS', value: 'XS' },
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' },
  { label: 'XXL', value: 'XXL' },
  { label: 'XXXL', value: 'XXXL' },
];
export const optionsPants: SelectOption[] = [
  { label: '2-3 Years', value: '2-3' },
  { label: '3-4 Years', value: '3-4' },
  { label: '4-5 Years', value: '4-5' },
  { label: '5-6 Years', value: '5-6' },
  { label: '6-7 Years', value: '6-7' },
  { label: '7-8 Years', value: '7-8' },
  { label: '8-9 Years', value: '8-9' },
  { label: '9-10 Years', value: '9-10' },
  { label: '10-11 Years', value: '10-11' },
  { label: '11-12 Years', value: '11-12' },
  { label: '12-13 Years', value: '12-13' },
  { label: '13-14 Years', value: '13-14' },
  { label: '14-15 Years', value: '14-15' },
  { label: '15-16 Years', value: '15-16' },
  { label: '28"', value: '28' },
  { label: '29"', value: '29' },
  { label: '30"', value: '30' },
  { label: '31"', value: '31' },
  { label: '32"', value: '32' },
  { label: '33"', value: '33' },
  { label: '34"', value: '34' },
  { label: '35"', value: '35' },
  { label: '36"', value: '36' },
  { label: '37"', value: '37' },
  { label: '38"', value: '38' },
  { label: '39"', value: '39' },
  { label: '40"', value: '40' },
];
export const optionsShoes: SelectOption[] = [
  { label: 'EU 16 / UK 0.5 / US 1', value: '16' },
  { label: 'EU 17 / UK 1 / US 2', value: '17' },
  { label: 'EU 18 / UK 2 / US 3', value: '18' },
  { label: 'EU 19 / UK 3 / US 4', value: '19' },
  { label: 'EU 20 / UK 4 / US 5', value: '20' },
  { label: 'EU 21 / UK 4.5 / US 5.5', value: '21' },
  { label: 'EU 22 / UK 5 / US 6', value: '22' },
  { label: 'EU 23 / UK 6 / US 7', value: '23' },
  { label: 'EU 24 / UK 7 / US 8', value: '24' },
  { label: 'EU 25 / UK 8 / US 9', value: '25' },
  { label: 'EU 26 / UK 8.5 / US 9.5', value: '26' },
  { label: 'EU 27 / UK 9 / US 10', value: '27' },
  { label: 'EU 28 / UK 10 / US 11', value: '28' },
  { label: 'EU 29 / UK 10.5 / US 11.5', value: '29' },
  { label: 'EU 30 / UK 11 / US 12', value: '30' },
  { label: 'EU 31 / UK 12 / US 13', value: '31' },
  { label: 'EU 32 / UK 13 / US 1', value: '32' },
  { label: 'EU 33 / UK 1 / US 2', value: '33' },
  { label: 'EU 34 / UK 2 / US 3', value: '34' },
  { label: 'EU 35 / UK 2.5 / US 3.5', value: '35' },
  { label: 'EU 36 / UK 3 / US 4', value: '36' },
  { label: 'EU 37 / UK 4 / US 5', value: '37' },
  { label: 'EU 38 / UK 5 / US 6', value: '38' },
  { label: 'EU 39 / UK 5.5 / US 6.5', value: '39' },
  { label: 'EU 40 / UK 6 / US 7', value: '40' },
  { label: 'EU 41 / UK 7 / US 8', value: '41' },
  { label: 'EU 42 / UK 8 / US 9', value: '42' },
  { label: 'EU 43 / UK 9 / US 10', value: '43' },
  { label: 'EU 44 / UK 9.5 / US 10.5', value: '44' },
  { label: 'EU 45 / UK 10 / US 11', value: '45' },
  { label: 'EU 46 / UK 11 / US 12', value: '46' },
  { label: 'EU 47 / UK 12 / US 13', value: '47' },
  { label: 'EU 48 / UK 13 / US 14', value: '48' },
];
export const optionsGlobal: SelectOption[] = [
  { label: 'XS', value: 'XS' },
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' },
  { label: 'XXL', value: 'XXL' },
  { label: 'XXXL', value: 'XXXL' },
];
export const optionsColors: SelectColorOption[] = [
  { label: 'slate', value: 'bg-slate-50' },
  { label: 'black', value: 'bg-black' },
  { label: 'gray1', value: 'bg-gray-300' },
  { label: 'gray2', value: 'bg-gray-600' },
  { label: 'stone1', value: 'bg-stone-400' },
  { label: 'stone2', value: 'bg-stone-600' },
  { label: 'red1', value: 'bg-red-400' },
  { label: 'red2', value: 'bg-red-600' },
  { label: 'orange1', value: 'bg-orange-400' },
  { label: 'orange2', value: 'bg-orange-600' },
  { label: 'yellow', value: 'bg-yellow-300' },
  { label: 'amber1', value: 'bg-amber-300' },
  { label: 'amber2', value: 'bg-amber-600' },
  { label: 'lime1', value: 'bg-lime-300' },
  { label: 'lime2', value: 'bg-lime-400' },
  { label: 'green1', value: 'bg-green-300' },
  { label: 'green2', value: 'bg-green-600' },
  { label: 'teal', value: 'bg-teal-300' },
  { label: 'teal', value: 'bg-teal-600' },
  { label: 'cyan1', value: 'bg-cyan-200' },
  { label: 'cyan3', value: 'bg-cyan-400' },
  { label: 'sky1', value: 'bg-sky-300' },
  { label: 'sky2', value: 'bg-sky-800' },
  { label: 'blue', value: 'bg-blue-600' },
  { label: 'purple1', value: 'bg-purple-300' },
  { label: 'purple2', value: 'bg-purple-600' },
  { label: 'fuchsia1', value: 'bg-fuchsia-300' },
  { label: 'fuchsia2', value: 'bg-fuchsia-600' },
  { label: 'pink1', value: 'bg-pink-300' },
  { label: 'pink2', value: 'bg-pink-600' },
  { label: 'rose1', value: 'bg-rose-300' },
  { label: 'rose2', value: 'bg-rose-800' },
  { label: 'nocolor', value: 'bg-white' },
];

export type ColorImages = {
  itemUrlList: string[];
  color: string;
};

// shared item values
export type ItemValues = {
  id: string;
  created: Timestamp;
  productName: string;
  slug: string;
  price: number;
};

// item/ product full data
export type NewItemValues = ItemValues & {
  colors: SelectColorOption[];
  sizes: SelectOption[];
  colorImagesUrls: ColorImages[];
  imgFileList: ImageColorsFiles[];
  stock: SizeStock[];
  initTotalStock: number;
  totalStock: number;
  discaount: number;
  details: string;
};

// category item
export type ItemPreview = ItemValues & {
  collectionKey: string;
  docKey: string;
  colors: SelectColorOption[];
  colorsSort: string[];
  sizesSort: string[];
  stock: SizeStock[];
  initTotalStock: number;
  totalStock: number;
  discaount: number;
  imagesUrls: string[];
};

type AddItemError = {
  key: string;
  message: string;
};

type AddItemProps = {
  onAddItem: (newItem: NewItemValues) => void;
};

type SelectOptionsMapping = {
  [key: string]: SelectOption[] | SelectColorOption[];
};

const defualtItemValues: NewItemValues = {
  id: '',
  // eslint-disable-next-line newline-per-chained-call
  // created: (new Date().toLocaleString().slice(0, 10).replace(/-/g, '-').replace(',', '').split('-').reverse().join('/')), // print this format 4/30/2023
  created: Timestamp.fromDate(new Date()),
  productName: '',
  slug: '',
  price: 0,
  colors: [],
  sizes: [],
  colorImagesUrls: [],
  imgFileList: [],
  stock: [],
  initTotalStock: 0,
  totalStock: 0,
  discaount: 0,
  details: '',
};

export const AddItem = ({ onAddItem }: AddItemProps) => {
  const [addItemValues, setAddItemValues] =
    useState<NewItemValues>(defualtItemValues);
  const [isError, setIsError] = useState<AddItemError[]>([]);
  const [addItemReducer, dispatch] = useReducer(
    AddItemReducer,
    ADDITEM_INITIAL_STATE
  );
  const { mounted, isImageUploadDone, isLoading } = addItemReducer;

  const { colors, sizes, imgFileList, price, productName } = addItemValues;
  // this two state hadling the types we have of select option like (global:s,m,l.. shoes:40,41,42..)
  const [isSelectTypeOption, setIsSelectTypeOption] = useState('');
  const [selectedTypeOption, setSelectedTypeOption] = useState<SelectOption[]>(
    []
  );
  const addFirebaseReducer = useSelector(selectAddFirebaseReducer);
  // useRef to reset the productName and price after reset values;
  const productNameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLTextAreaElement>(null);

  const selectOptionsMapping: SelectOptionsMapping = useMemo(() => {
    return {
      shirts: [...optionsShirts],
      pants: [...optionsPants],
      shoes: [...optionsShoes],
      global: [...optionsGlobal],
      colors: [...optionsColors],
    };
  }, []);

  // image upload functions
  const UploadAsync = useCallback(
    async (imgFileList: ImageColorsFiles) => {
      // dispatch(featchUploadImageStart());
      // check if the color exsist when adding more colors after the first time
      if (
        addItemValues.colorImagesUrls.some(
          (colorImg) => colorImg.color === imgFileList.color
        )
      ) {
        return;
      }

      try {
        const promises = imgFileList.files.map(async (file) => {
          const imageRef = ref(storageFB, `images/${file.name + v4()}`);
          const snapshot = await uploadBytes(imageRef, file);
          return await getDownloadURL(snapshot.ref);
        });

        const urlArray = await Promise.all(promises);

        const colorImages: ColorImages = {
          itemUrlList: urlArray,
          color: imgFileList.color,
        };
        setAddItemValues((prevState) => {
          return {
            ...prevState,
            colorImagesUrls: [...prevState.colorImagesUrls, colorImages],
            imgFileList: [],
          };
        });
      } catch (error: any) {
        dispatch(featchUploadImageFailed(error));
      }
    },
    [addItemValues, dispatch]
  );

  async function imageUploadAsync() {
    dispatch(featchUploadImageStart);
    const uploadPromises = imgFileList.map((fileList) => {
      return UploadAsync(fileList);
    });
    const responses = await Promise.all(uploadPromises);
    dispatch(featchUploadImageSuccess);
  }

  // error checker before submit
  function errorChecker() {
    const newErrors: AddItemError[] = [];

    if (Array.isArray(imgFileList) && imgFileList.length !== colors.length) {
      newErrors.push({
        key: 'imgFileList',
        message: 'Upload image for the choosen color',
      });
    }
    if (Array.isArray(sizes) && sizes.length === 0) {
      newErrors.push({ key: 'sizes', message: 'Size must be choose' });
    }
    if (Array.isArray(colors) && colors.length === 0) {
      newErrors.push({
        key: 'colors',
        message: 'Color must be choose or no-color option',
      });
    }
    if (price === 0) {
      newErrors.push({ key: 'price', message: 'You must enter product price' });
    }
    if (productName === '') {
      newErrors.push({
        key: 'productName',
        message: 'You must enter product name',
      });
    }
    setIsError(newErrors);
  }

  // listen to selectTypeOption and sent the new option to select
  useEffect(() => {
    setSelectedTypeOption(selectOptionsMapping[isSelectTypeOption] || []);
  }, [isSelectTypeOption, selectOptionsMapping]);

  // mounted is used to prevent this useEffect run on initial load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    !mounted && isError.length > 0 && errorChecker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addItemValues]);

  // useEffect for passing the newItem to parent component AddFirebase also reset form fields
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isLoading === false && isImageUploadDone === true) {
      onAddItem(addItemValues);
      if (
        productNameRef.current !== null &&
        productNameRef.current !== undefined
      ) {
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
      imgFileList: prevState.imgFileList.filter((item) =>
        colors.some((color) => color.label === item.color)
      ),
    }));
  }, [colors]);

  const addItemHandler = () => {
    setAddItemValues((prevState) => ({
      ...prevState,
      slug: slug(productName),
    }));
    setAddItemValues((prevState) => ({
      ...prevState,
      id: `${
        prevState.slug +
        addFirebaseReducer.collectionKey +
        addFirebaseReducer.docKey +
        v4()
      }`,
    }));
    if (mounted === false) {
      dispatch(featchMounted(true));
    }
    errorChecker();
  };

  const AddItemAsync = async () => {
    if (isError.length === 0 && mounted) {
      dispatch(featchMounted(false));
      await imageUploadAsync();
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
      const promise = AddItemAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, mounted]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddItemValues({ ...addItemValues, [e.target.name]: e.target.value });
  };

  const onChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    setAddItemValues({ ...addItemValues, price: e.target.valueAsNumber });
  };
  // prevent input number to except the following chars
  const exceptThisSymbols = ['e', 'E', '+', '-'];
  return (
    <div className="flex flex-col">
      {/* title */}
      <div className="mb-2 flex justify-center text-xl font-semibold  text-gray-800">
        New Item
      </div>
      {/* error handling */}
      {isError.length > 0 && (
        <div className="flex flex-col">
          <div className="alert alert-warning my-2 flex flex-col bg-yellow-200 shadow-lg">
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
              <span>Warning: Invalid the following inputs</span>
            </div>
            <div className="flex flex-wrap">
              {isError.map((error) => {
                return (
                  <span
                    className="flex  text-red-600"
                    key={`${error.key}error`}
                  >
                    <div className="flex items-center justify-center p-1 pt-2">
                      <div className="h-1 w-1 rounded-full bg-black opacity-50"></div>
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
        <div className="mx-1 mb-2  flex justify-center rounded-lg bg-gray-100 p-2 shadow-md">
          <div className="flex w-80 flex-col">
            <div className="w-full max-w-xs">
              <label className="pb-1">
                <span className="label-text">Product Name</span>
              </label>
              <input
                ref={productNameRef}
                type="text"
                name="productName"
                placeholder="Product Name"
                onChange={onChange}
                className="flex min-h-[2.8em] w-full flex-shrink items-center rounded-lg border bg-white p-2 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-gray-400"
              />
            </div>
            <div className="w-full max-w-xs">
              <label className="label pb-1">
                <span className="label-text">Price</span>
              </label>
              <input
                ref={priceRef}
                onKeyDown={(e) =>
                  exceptThisSymbols.includes(e.key) && e.preventDefault()
                }
                type="number"
                name="price"
                placeholder="Price"
                min="0"
                onChange={onChangePrice}
                className="flex min-h-[2.8em] w-full flex-shrink items-center rounded-lg border bg-white p-2 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-gray-400"
              />
            </div>
            <div className="w-full max-w-xs">
              <label className="label pb-1">
                <span className="label-text">Size types options</span>
              </label>
              <div className="btn-group flex justify-center">
                {Object.keys(selectOptionsMapping).map((option) => (
                  <button
                    key={option}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsSelectTypeOption(option);
                    }}
                    type="button"
                    name={option}
                    className={`btn-accent btn-sm btn border-0 text-gray-600 shadow-md ${
                      isSelectTypeOption === option
                        ? 'bg-accent'
                        : 'bg-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full max-w-xs">
              <label className="label pb-1">
                <span className="label-text">Size</span>
              </label>
              <div className="relative">
                <Select
                  multiple
                  firstOption={{ label: 'Select Size', value: '' }}
                  options={selectedTypeOption}
                  onChange={(objSizes) => {
                    setAddItemValues({ ...addItemValues, sizes: objSizes });
                  }}
                  value={sizes}
                />
                {isSelectTypeOption === '' && (
                  <div className="absolute top-0 h-full w-full cursor-not-allowed rounded-lg bg-black opacity-20"></div>
                )}
              </div>
            </div>
            <div className="w-full max-w-xs">
              <label className="label pb-1">
                <span className="label-text">Color</span>
              </label>
              <SelectColor
                firstOption={{ label: 'Select Color', value: '' }}
                options={optionsColors}
                onChange={(objColors) => {
                  setAddItemValues({ ...addItemValues, colors: objColors });
                }}
                value={colors}
              />
            </div>
            <div className="w-full max-w-xs">
              <label className="label pb-1">
                <span className="label-text">Details</span>
              </label>
              <textarea
                ref={detailsRef}
                placeholder="Item details"
                className="textarea-bordered textarea textarea-sm h-32 w-full max-w-xs text-base leading-5"
                onChange={(e) => {
                  setAddItemValues({
                    ...addItemValues,
                    details: e.target.value,
                  });
                }}
              ></textarea>
            </div>
          </div>
        </div>

        {/* IMAGES */}
        {Array.isArray(addItemValues.colors) &&
          addItemValues.colors.length !== 0 && (
            <div className="col-span-3 mx-1 flex justify-center rounded-lg bg-gray-100 p-2 shadow-md lg:col-span-2">
              <div className="flex flex-col">
                <label className="m-0 flex justify-center p-0">
                  <span className="label-text">Images</span>
                </label>
                <div className="flex flex-wrap justify-center gap-2 gap-y-1">
                  {colors.map((color) => {
                    return color.label === 'nocolor' ? (
                      <div
                        key={color.label}
                        className="mt-2 max-w-xs rounded-lg p-2 shadow-lg"
                      >
                        <UploadInput
                          colorLabel={color.label}
                          onChange={(colorImages) => {
                            setAddItemValues((addItemValues) => ({
                              ...addItemValues,
                              colorImagesUrls: [
                                ...addItemValues.colorImagesUrls,
                                colorImages,
                              ],
                            }));
                          }}
                          onChangeFiles={(imgColors) => {
                            const updatedStock = [...addItemValues.imgFileList];
                            updatedStock.push(imgColors);
                            setAddItemValues((prevState) => ({
                              ...prevState,
                              imgFileList: updatedStock,
                            }));
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        key={color.label}
                        className={`${color.value} mt-1 max-w-xs rounded-lg p-1 shadow-lg`}
                      >
                        <UploadInput
                          colorLabel={color.label}
                          onChange={(colorImages) => {
                            setAddItemValues((addItemValues) => ({
                              ...addItemValues,
                              colorImagesUrls: [
                                ...addItemValues.colorImagesUrls,
                                colorImages,
                              ],
                            }));
                          }}
                          onChangeFiles={(imgColors) => {
                            const updatedStock = [...addItemValues.imgFileList];
                            updatedStock.push(imgColors);
                            setAddItemValues((prevState) => ({
                              ...prevState,
                              imgFileList: updatedStock,
                            }));
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        {/* STOCK COMPONENT */}
        {Array.isArray(addItemValues.sizes) &&
          addItemValues.sizes.length !== 0 &&
          Array.isArray(addItemValues.colors) &&
          addItemValues.colors.length !== 0 && (
            <div className="col-span-3 flex justify-center rounded-lg bg-gray-100 py-2 shadow-md">
              <div className="flex flex-col">
                <label className="label m-0 justify-center p-0">
                  <span className="label-text">Stock</span>
                </label>
                <AddItemStock
                  onChange={(ItemStock) => {
                    setAddItemValues(() => ({
                      ...addItemValues,
                      stock: ItemStock,
                    }));
                  }}
                  colors={colors}
                  sizes={sizes}
                />
              </div>
            </div>
          )}

        <div className="flex w-full flex-col pb-2 md:col-span-3">
          <div className="divider mx-4"></div>
          <div className="flex justify-end">
            <button
              type="button"
              className={`btn-accent btn ${
                isLoading ? 'loading' : ''
              } btn-sm mx-4 text-gray-700`}
              onClick={addItemHandler}
            >
              Create Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AddItem);
