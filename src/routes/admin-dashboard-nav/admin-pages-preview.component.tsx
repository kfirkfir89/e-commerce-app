import {
  ChangeEvent,
  FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Carousel from '../../components/carousel/carousel.component';
import Select, { SelectOption } from '../../components/select/select.component';
import { getUserKeysDocs } from '../../utils/firebase/firebase.category.utils';
import {
  getUserCollectionKeys,
  setHomePagePreviewData,
} from '../../utils/firebase/firebase.utils';

type SelectOptionTypeContextProps = {
  categoriesKeys: SelectOption[];
  productListKeys: SelectOption[];
  // setCategoriesKeys: (value: SelectOption[]) => void;
  // setProductListKeys: (value: SelectOption[]) => void;
};

const SelectOptionTypeContext = createContext<SelectOptionTypeContextProps>({
  categoriesKeys: [],
  productListKeys: [],
  // setCategoriesKeys: () => {},
  // setProductListKeys: () => {},
});

type SmallImageBannerProps = {
  radioName: string;
  name: string;
  changeSmallImageData: (imgData: SmallImageBannerData) => void;
};

export type SmallImageBannerData = {
  radioName: string;
  name: string;
  selectedOption: SelectOption;
  isProductList: boolean;
  image: File | null;
  imageUrl: string;
};

export type BigBannerData = {
  selectedOption: SelectOption;
  isProductList: boolean;
  image: File[];
  imageUrl: string[];
};

export type SmallImagesOptionsMapping = {
  [key: string]: SmallImageBannerData;
};

const smallImages: SmallImagesOptionsMapping = {
  image1: {
    name: 'image1',
    radioName: 'radio-10',
    image: null,
    isProductList: false,
    selectedOption: { label: '', value: '' },
    imageUrl: '',
  },
  image2: {
    name: 'image2',
    radioName: 'radio-20',
    image: null,
    isProductList: false,
    selectedOption: { label: '', value: '' },
    imageUrl: '',
  },
  image3: {
    name: 'image3',
    radioName: 'radio-30',
    image: null,
    isProductList: false,
    selectedOption: { label: '', value: '' },
    imageUrl: '',
  },
  image4: {
    name: 'image4',
    radioName: 'radio-40',
    image: null,
    isProductList: false,
    selectedOption: { label: '', value: '' },
    imageUrl: '',
  },
  image5: {
    name: 'image5',
    radioName: 'radio-50',
    image: null,
    isProductList: false,
    selectedOption: { label: '', value: '' },
    imageUrl: '',
  },
  image6: {
    name: 'image6',
    radioName: 'radio-60',
    image: null,
    isProductList: false,
    selectedOption: { label: '', value: '' },
    imageUrl: '',
  },
};
// COMPONENTS

const SmallImageBanner = ({
  radioName,
  name,
  changeSmallImageData,
}: SmallImageBannerProps) => {
  const { categoriesKeys, productListKeys } = useContext(
    SelectOptionTypeContext
  );
  const [imageData, setImageData] = useState<SmallImageBannerData>({
    radioName,
    name,
    selectedOption: { label: 'Pick an Image', value: '' },
    isProductList: false,
    image: null,
    imageUrl: '',
  });

  useEffect(() => {
    changeSmallImageData(imageData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData]);

  const onChangeSelectOptionType = (option: SelectOption | undefined) => {
    option && setImageData({ ...imageData, selectedOption: option });
  };

  const imageUploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const fileArray = Array.from(e.target.files);
      setImageData({ ...imageData, image: fileArray[0] });
    }
  };
  return (
    <div className="mb-8 flex flex-col items-center gap-2">
      <div className="form-control w-full max-w-xs">
        <div className="flex h-full w-full flex-col justify-end gap-2 pb-4 font-smoochSans text-sm capitalize tracking-widest">
          <div className="form-control">
            <label className="flex cursor-pointer">
              <input
                type="radio"
                name={`${radioName}`}
                className="radio checked:bg-slate-700 "
                onChange={() =>
                  setImageData((prev) => ({ ...prev, isProductList: false }))
                }
                checked={!imageData.isProductList}
              />
              <span className="flex-1 px-2 leading-6">
                exsisting collection
              </span>
            </label>
          </div>
          <div className="form-control">
            <label className="flex cursor-pointer">
              <input
                type="radio"
                name={`${radioName}`}
                className="radio checked:bg-slate-700"
                onChange={() =>
                  setImageData((prev) => ({ ...prev, isProductList: true }))
                }
                checked={imageData.isProductList}
              />
              <span className="flex-1 px-2 leading-6">product list</span>
            </label>
          </div>
        </div>
        <Select
          onChange={(option) => onChangeSelectOptionType(option)}
          options={imageData.isProductList ? productListKeys : categoriesKeys}
          value={imageData.selectedOption}
          firstOption={{ label: 'Pick a Category/List', value: '' }}
        />
      </div>
      <div className="p-4">
        <input
          onChange={imageUploadHandler}
          type="file"
          className="file-input-bordered file-input w-full max-w-xs rounded-none bg-white shadow-lg"
        />
      </div>

      <div className="w-full max-w-[224px]">
        {imageData.image && (
          <img
            key={`Image${imageData.name}`}
            alt={`${imageData.name}`}
            src={URL.createObjectURL(imageData.image)}
          />
        )}
      </div>
    </div>
  );
};

const PagesPreview = () => {
  const [bigBanerData, setBigBanerData] = useState<BigBannerData>({
    selectedOption: { label: '', value: '' },
    isProductList: false,
    image: [],
    imageUrl: [],
  });
  const [smallBanersImages, setSmallBanersImages] =
    useState<SmallImagesOptionsMapping>(smallImages);

  const [error, setError] = useState('');
  const [categoriesKeys, setCategoriesKeys] = useState<SelectOption[]>([]);
  const [productListKeys, setProductListKeys] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const contextProviderValues = useMemo(
    () => ({
      categoriesKeys,
      productListKeys,
      // setCategoriesKeys,
      // setProductListKeys,
    }),
    [categoriesKeys, productListKeys]
  );

  useEffect(() => {
    const getCategories = async () => {
      try {
        const keys = await getUserCollectionKeys();
        const keysOptions: SelectOption[] = [];
        keys.forEach((key) => keysOptions.push({ label: key, value: key }));
        setCategoriesKeys(keysOptions);
      } catch (error) {
        console.log('error:', error);
      }
    };
    const getProductLists = async () => {
      try {
        const keys = await getUserKeysDocs('user-products-list');
        console.log('keys:', keys);
        const keysOptions: SelectOption[] = [];
        keys.forEach((key) => keysOptions.push({ label: key, value: key }));
        setProductListKeys(keysOptions);
      } catch (error) {
        console.log('error:', error);
      }
    };
    const fetchCategoriesKeys = getCategories();
    const fetchProductListsKeys = getProductLists();
  }, []);

  const imageUploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      if (e.target.files.length % 2 !== 0) {
        setError('upload even number of images');
      }
      const fileArray = Array.from(e.target.files);
      setBigBanerData({ ...bigBanerData, image: fileArray });
    }
  };

  const setSmallBannerImageData = (imgData: SmallImageBannerData) => {
    setSmallBanersImages((prevImages) => ({
      ...prevImages,
      [imgData.name]: imgData,
    }));
  };

  const onChangeSelectOptionType = (option: SelectOption | undefined) => {
    option && setBigBanerData({ ...bigBanerData, selectedOption: option });
  };

  const submitChangesHandler = () => {
    const uploadHomePage = async (
      bigBanerData: BigBannerData,
      smallBanersImages: SmallImagesOptionsMapping
    ) => {
      console.log('bigBanerData:', bigBanerData, smallBanersImages);
      try {
        const upload = setHomePagePreviewData(bigBanerData, smallBanersImages);
      } catch (error) {
        setError((error as Error).message);
      }
    };
    const uploadData = uploadHomePage(bigBanerData, smallBanersImages);
  };

  return (
    <SelectOptionTypeContext.Provider value={contextProviderValues}>
      <div className="flex h-full w-full justify-center gap-2 px-2">
        <div className="container flex h-full flex-col items-center">
          <h2 className="mb-6 text-center text-2xl font-semibold capitalize text-gray-600">
            home page preview
          </h2>
          <div className="mb-12 flex w-full flex-col items-center bg-gray-100 p-4 pt-8">
            <div className="mb-8">
              <div className="flex w-full flex-col  gap-2 pb-4 font-smoochSans text-sm capitalize tracking-widest">
                <div className="form-control">
                  <label className="flex cursor-pointer">
                    <input
                      type="radio"
                      name="radio-0"
                      className="radio checked:bg-slate-700"
                      onChange={() =>
                        setBigBanerData((prev) => ({
                          ...prev,
                          isProductList: false,
                        }))
                      }
                      checked={!bigBanerData.isProductList}
                    />
                    <span className="flex-1 px-2 leading-6">
                      exsisting collection
                    </span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="flex cursor-pointer">
                    <input
                      type="radio"
                      name="radio-0"
                      className="radio checked:bg-slate-700 "
                      onChange={() =>
                        setBigBanerData((prev) => ({
                          ...prev,
                          isProductList: true,
                        }))
                      }
                      checked={bigBanerData.isProductList}
                    />
                    <span className="flex-1 px-2 leading-6">product list</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <Select
                  onChange={(option) => onChangeSelectOptionType(option)}
                  options={
                    bigBanerData.isProductList
                      ? productListKeys
                      : categoriesKeys
                  }
                  value={bigBanerData.selectedOption}
                  firstOption={{ label: 'Pick a Category/List', value: '' }}
                />
              </div>
              <div className="alert max-w-xs rounded-none p-2">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 flex-shrink-0 stroke-info"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="text-sm">
                    Please upload an even number of images.
                  </span>
                </div>
              </div>
              <input
                onChange={imageUploadHandler}
                type="file"
                className="file-input-bordered file-input w-full max-w-xs rounded-none bg-white shadow-lg"
                multiple
              />
            </div>
            <div className="flex w-full max-w-xl flex-col sm:hidden">
              <Carousel images={bigBanerData.image} />
            </div>
            <div className="hidden w-full max-w-xl sm:flex">
              <Carousel
                images={bigBanerData.image.filter(
                  (img, index) => index % 2 === 0
                )}
              />
              <Carousel
                images={bigBanerData.image.filter(
                  (img, index) => index % 2 === 1
                )}
              />
            </div>
          </div>
          {/* small images */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {Object.values(smallImages).map((img: SmallImageBannerData) => (
              <SmallImageBanner
                key={img.name}
                changeSmallImageData={setSmallBannerImageData}
                name={img.name}
                radioName={img.radioName}
              />
            ))}
          </div>
          <button onClick={submitChangesHandler} className="btn">
            save changes
          </button>
        </div>
      </div>
    </SelectOptionTypeContext.Provider>
  );
};
export default PagesPreview;
