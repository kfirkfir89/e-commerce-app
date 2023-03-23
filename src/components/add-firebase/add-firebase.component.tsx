import {
  ChangeEvent, FormEvent, useEffect, useState, useMemo, useRef, useCallback, 
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import slug from 'slug';
import { NewCollectionDocItemsForm, NewItem, StockItem } from '../../store/add-firebase/add-firebase.reducer';
import { featchCategoriesStart } from '../../store/categories/category.action';
import { selectCategories } from '../../store/categories/category.selector';
import { RootState } from '../../store/store';
import {
  AddCollectionAndDocuments, getCategoriesAndDocuments, getUserCollectionKeys, Keys, storageFB, 
} from '../../utils/firebase/firebase.utils';
import Select, { SelectOption } from '../select/select.component';
import UploadInput, {
  featchUploadImageFailed, featchUploadImageStart, featchUploadImageSuccess, ImageColorsFiles, 
} from '../upload-input/upload-input.component';
import SelectColor, { SelectColorOption } from '../select-color/select-color.component';
import { ReactComponent as NoColorIcon } from '../../assets/format_color_reset.svg';
import { ReactComponent as AddIcon } from '../../assets/add_FILL0.svg';
import { ReactComponent as RemoveIcon } from '../../assets/remove_FILL0.svg';
import FormInput from '../input-form/input-form.component';


const defualtNewCollectionAndDocForm: NewCollectionDocItemsForm = {
  collectionKey: '',
  title: '',
  items: [],
};
// const defualtNewItem: NewItem = {
//   id: '',
//   imageUrl: [],
//   productName: '',
//   price: 0,
//   sizes: [],
//   colors: undefined,
//   stock: [],
// };

// const defualtStockItem: StockItem = {
//   size: '',
//   color: '',
//   supply: 0,
// };
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

type ColorStock = { label: string, value: string, count: number };
type SizeStock = {
  size: string
  colors: ColorStock[]
};

export type ColorImages = {
  itemUrlList: string[]
  color: string
};

export type ItemValues = {
  id: string
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

const defualtItemValues: ItemValues = {
  id: '',
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


// STOCK COMPONENT
type AddItemStockProps = {
  colors: SelectColorOption[]
  sizes: SelectOption[]
  onChange: (ItemStock: SizeStock[]) => void
};

const AddItemStock = ({ onChange, colors, sizes }: AddItemStockProps) => {
  const [stock, setStock] = useState<SizeStock[]>([]);
  // prevent input number to except the following chars
  const exceptThisSymbols = ['e', 'E', '+', '-', '.'];

  useEffect(() => {
    onChange(stock);
  }, [stock]);
  
  // listen to sizes for changes for removing the stock
  useEffect(() => {
    setStock((prevState) => {
      const newStock = prevState.filter((sizeStock) => {
        return sizes.some((size) => size.label === sizeStock.size);
      });
      return newStock;
    });
  }, [sizes]);
  
  // set initial stock value depend on size or filter depend on changes
  useEffect(() => {
    setStock((prevState) => {
      const updatedStock = prevState;
  
      sizes.forEach((s) => {
        const existingSizeStockIndex = updatedStock.findIndex((ss) => ss.size === s.label);
        if (existingSizeStockIndex !== -1) {
          updatedStock[existingSizeStockIndex] = {
            size: s.label,
            colors: colors.map((c) => {
              const existingColorStockIndex = updatedStock[existingSizeStockIndex].colors.findIndex((cs) => cs.value === c.value);
              if (existingColorStockIndex !== -1) {
                return updatedStock[existingSizeStockIndex].colors[existingColorStockIndex];
              } 
              return { label: c.label, value: c.value, count: 0 };
            }),
          };
        } else {
          updatedStock.push({
            size: s.label,
            colors: colors.map((c) => ({ label: c.label, value: c.value, count: 0 })),
          });
        }
      });
      return updatedStock;
    });
  }, [colors, sizes]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    // Find the index of the selected size in the stock state
    const sizeIndex = stock.findIndex((s) => s.size === e.target.value);
    if (stock[sizeIndex].colors === undefined) return;
    // Find the index of the selected color in the colors array of the selected size
    const colorIndex = stock[sizeIndex].colors?.findIndex((color) => color.label === c.label);
    
    // Update the count of the selected color
    const updatedStock = [...stock];
    updatedStock[sizeIndex].colors[colorIndex].count += 1;
    
    // Update the state with the updated stock
    setStock(updatedStock);
  };

  return (
    <div className="flex flex-wrap justify-center mb-1 gap-x-2">
      {/* render each size */}
      {stock.map((item) => {
        return (
          <div key={`${item.size}`} className="flex flex-col shadow-lg w-fit my-1">

            <div className="flex justify-center items-center bg-white text-gray-700 p-1 shadow-lg w-full rounded-t-lg font-semibold">
              Size
              {' '}
              {item.size}
              {' '}
              stock
            </div>

            <div className="flex flex-col w-72 sm:w-fit">
              { item.colors
                && item.colors.map((c, i) => {
                  return (
                    <div key={`${c.label}inputstock`} className="flex">
                      <div className={`w-full max-w-xs ${c.value} p-2 ${(i + 1 === colors.length) ? 'rounded-b-lg' : ''}`}>
                        <FormInput
                          onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                          type="number"
                          name={c.label}
                          label={`stock of size ${item.size} color ${c.label}`}
                          min="0"
                          onChange={(e) => { // Find the index of the selected size in the stock state
                            const sizeIndex = stock.findIndex((s) => s.size === item.size);
                            if (stock[sizeIndex].colors === undefined) return;
                            // Find the index of the selected color in the colors array of the selected size
                            const colorIndex = stock[sizeIndex].colors?.findIndex((color) => color.label === c.label);

                            // Update the count of the selected color
                            const updatedStock = [...stock];
                            
                            updatedStock[sizeIndex].colors[colorIndex].count = e.target.valueAsNumber;

                            // Update the state with the updated stock
                            setStock(updatedStock);
                          }}
                          required
                          errorMessage="stock is empty"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div> 

        );
      })}
    </div>
  );
};

// ADDITEM COMPONENT

type AddItemError = {
  key: string
  message: string
};


const AddItem = () => {
  const [addItemValues, setAddItemValues] = useState<ItemValues>(defualtItemValues);
  const [isError, setIsError] = useState<AddItemError[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isSelectTypeOption, setIsSelectTypeOption] = useState('');
  const [selectedTypeOption, setSelectedTypeOption] = useState<SelectOption[]>([]);

  const {
    colors, sizes,
  } = addItemValues;
  const dispatch = useDispatch();

  const UploadAsync = useCallback(async (listImgColors: ImageColorsFiles) => {
    // dispatch(featchUploadImageStart());
    // check if the color exsist when adding more colors after the first time
    if (addItemValues.colorImagesUrls.some((colorImg) => colorImg.color === listImgColors.color)) {
      return;
    }
    const urlList:string[] = [];
    try {
      const promises = listImgColors.files.map(async (file) => {
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
        color: listImgColors.color,
      };
      setAddItemValues((prevState) => { return { ...prevState, colorImagesUrls: [...prevState.colorImagesUrls, colorImages] }; });
    } catch (error: any) {
      dispatch(featchUploadImageFailed(error));
    }
  }, [addItemValues, dispatch]);
  

  const errorChecker = () => {
    // upload the image here
    // addItemValues.imgFileList.map((listImgColors) => (
    //   UploadAsync(listImgColors)
    // ));
    setMounted(true);
    const newErrors: AddItemError[] = []; 
    // if (Array.isArray(addItemValues.stock) && addItemValues.stock.length === 0) {
    //   newErrors.push({ key: 'stock', message: 'Upload image for the choosen color' });
    // }
    if (Array.isArray(addItemValues.imgFileList) && addItemValues.imgFileList.length !== addItemValues.colors.length) {
      newErrors.push({ key: 'imgFileList', message: 'Upload image for the choosen color' });
    }
    if (Array.isArray(addItemValues.sizes) && addItemValues.sizes.length === 0) {
      newErrors.push({ key: 'sizes', message: 'Size must be choose' });
    }
    if (Array.isArray(addItemValues.colors) && addItemValues.colors.length === 0) {
      newErrors.push({ key: 'colors', message: 'Color must be choose or no-color option' });
    }
    if (addItemValues.price === 0) {
      newErrors.push({ key: 'price', message: 'You must enter product price' });
    }
    if (addItemValues.productName === '') {
      newErrors.push({ key: 'productName', message: 'You must enter product name' });
    }
    
    setIsError(newErrors);
  };
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
  useEffect(() => { mounted && errorChecker(); }, [addItemValues]);

  // listen to colors for changes for removing the uploaded images
  useEffect(() => {
    setAddItemValues((prevState) => ({
      ...prevState,
      imgFileList: prevState.imgFileList.filter((item) => colors.some((color) => color.label === item.color)),
    }));
  }, [colors]);
  
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddItemValues({ ...addItemValues, [e.target.name]: e.target.value });
  };
  console.log('addItemValues:', addItemValues);
  // prevent input number to except the following chars
  const exceptThisSymbols = ['e', 'E', '+', '-', '.'];
  return (
    <div className="flex flex-col p-2">
      {/* title */}
      <div className="flex justify-center text-xl pb-2 text-gray-800 bg-gray-100 rounded-lg shadow-md mb-2 font-semibold">New Item</div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 ">
        {/* FORM INPUTS */}
        <div className="flex justify-center sm:ml-0 ml-2 bg-gray-100 rounded-lg shadow-md">
          <div className="flex flex-col w-80">
            <div className="w-full max-w-xs">
              <label className="pb-1">
                <span className="label-text">Product Name</span>
              </label>
              <FormInput type="text" name="productName" placeholder="Product Name" label="Product Name" pattern="^[A-Za-z0-9]{3,50}$" onChange={onChange} required errorMessage="Enter product name" />
            </div>
            <div className="w-full max-w-xs">
              <label className="label pb-1">
                <span className="label-text">Price</span>
              </label>
              <FormInput onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()} type="number" name="price" placeholder="Price" label="Price" min="0" onChange={onChange} required errorMessage="Price can't be 0" />
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
                <Select multiple firstOption={{ label: 'Select Size', value: '' }} options={selectedTypeOption} onChange={(objSizes) => { setAddItemValues({ ...addItemValues, sizes: objSizes }); }} value={addItemValues.sizes} />
                {isSelectTypeOption === '' && <div className="absolute top-0 bg-black w-full h-full cursor-not-allowed opacity-20 rounded-lg"></div>}
              </div>
            </div>



            <div className="w-full max-w-xs">
              <label className="label pb-1">
                <span className="label-text">Color</span>
              </label>
              <SelectColor firstOption={{ label: 'Select Color', value: '' }} options={optionsColors} onChange={(objColors) => { setAddItemValues({ ...addItemValues, colors: objColors }); }} value={addItemValues.colors} />
            </div>
            <div className="w-full max-w-xs">
              <label className="label pb-1">
                <span className="label-text">Details</span>
              </label>
              <textarea placeholder="Item details" className="textarea textarea-bordered textarea-sm w-full max-w-xs leading-5 text-base h-32" onChange={(e) => { setAddItemValues({ ...addItemValues, details: e.target.value }); }}></textarea>
            </div>
          </div>
        </div>

        {/* IMAGES */}
        {(Array.isArray(addItemValues.colors) && addItemValues.colors.length !== 0) 
          && (
            <div className="flex justify-center col-span-3 lg:col-span-2 bg-gray-100 rounded-lg shadow-md">
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
        <div className="flex justify-center col-span-3 bg-gray-100 rounded-lg shadow-md">
          {(Array.isArray(addItemValues.sizes) && addItemValues.sizes.length !== 0) 
              && (Array.isArray(addItemValues.colors) && addItemValues.colors.length !== 0)
              && (
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
              )}
        </div>

        <div className="md:col-span-3 flex flex-col">
          <div className="border-t border-gray-700 w-full my-2 opacity-30"></div>
          <div className="flex justify-end">
            <button type="button" className="btn btn-accent btn-sm text-gray-700" onClick={errorChecker}>Create Item</button>
          </div>
        </div>
          
      </div>
      
    </div>
  );
};

// SELECTREF COMPONENT
type SelectRefProps = {
  collectionKey: SelectOption | undefined
  docTitle: SelectOption | undefined
  onChangeKey: (collectionKey: SelectOption | undefined) => void
  onChangeTitle: (title: SelectOption | undefined) => void
};

const SelectDbRef = ({
  collectionKey, docTitle, onChangeKey, onChangeTitle, 
}: SelectRefProps) => {
  const [isNewCollection, setIsNewCollection] = useState(false);
  const [isNewDoc, setIsNewDoc] = useState(false);

  const [keysOptions, setKeysOptions] = useState<SelectOption[]>([]);
  const [docOptions, setDocOptions] = useState<SelectOption[]>([]);
  const memoizedKeysOptions = useMemo(() => keysOptions, [keysOptions]);

  // const urlList = useSelector((state: RootState) => state.uploadImg.urlList);
  // fetch the collection custom keys of the user(admin)
  useEffect(() => {
    (async () => {
      try {
        const keys: Keys[] = await getUserCollectionKeys();
        const keysOptions: SelectOption[] = keys[0].keys.map((key) => {
          return { label: key, value: key };
        }); 
        setKeysOptions(keysOptions);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // fetch the collection docs title
  useEffect(() => {
    (async () => {
      if (collectionKey) {
        try {
          const collectionDocs = await getCategoriesAndDocuments(collectionKey?.label);
          const docsTitle: SelectOption[] = collectionDocs.map((doc) => {
            return { label: doc.title, value: doc.title };
          });
          setDocOptions(docsTitle);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [collectionKey]);

  useEffect(() => {
    if (isNewCollection) {
      onChangeKey({ label: '', value: '' });
    }
    if (isNewDoc) {
      onChangeTitle({ label: '', value: '' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewCollection, isNewDoc]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'collectionKey') {
      const newKey: SelectOption = {
        label: e.target.name,
        value: e.target.value,
      };
      onChangeKey(newKey);
    }
    
    if (e.target.name === 'title') {
      const newTitle: SelectOption = {
        label: e.target.name,
        value: e.target.value,
      };
      onChangeTitle(newTitle);
    }
  };
  return (
    <div className="flex flex-col">
      <div className="flex justify-center text-xl text-gray-800 font-semibold pb-2 bg-gray-100 rounded-lg shadow-md my-2">Data Referance</div>
      <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 ">

          <div className="flex flex-col w-72 sm:w-80 p-2">
            {/* TOGGLE BUTTON */}
            <label className="pb-1 flex justify-center ">
              <span className="label-text whitespace-nowrap pr-2 font-semibold">New collection</span>
              <input type="checkbox" onClick={() => { setIsNewCollection(!isNewCollection); }} className="toggle toggle-success" />
            </label>
            {/* INPUT VALUES */}
            <div className="flex justify-center">
              <div className={`w-full max-w-xs shadow-md rounded-lg ${isNewCollection ? 'hidden' : 'block'}`}>
                <Select firstOption={{ label: 'Pick a collection', value: '' }} options={memoizedKeysOptions} onChange={(o: SelectOption | undefined) => { onChangeKey(o); }} value={collectionKey} />
              </div>
              <input required onChange={onChange} type="text" name="collectionKey" placeholder="new collection key" className={`input input-bordered shadow-md rounded-lg w-full max-w-xs ${isNewCollection ? 'block' : 'hidden'}`} />
            </div>
          </div>

          <div className="flex flex-col sm:w-80 p-2 ">
            {/* TOGGLE BUTTON */}
            <label className={`pb-1 flex flex-grow justify-center ${(collectionKey !== undefined && collectionKey.value === '') || isNewCollection ? 'invisible' : 'visible'}`}>
              <span className="label-text whitespace-nowrap pr-2 font-semibold">New document</span>
              <input type="checkbox" onClick={() => { setIsNewDoc(!isNewDoc); }} className="toggle toggle-success" disabled={isNewCollection} />
            </label>
            {/* INPUT VALUES */}
            <div className="flex flex-grow justify-center">
              <div className={`w-full max-w-xs shadow-md rounded-lg ${(isNewCollection || isNewDoc) || (collectionKey !== undefined && collectionKey.value === '') ? 'hidden' : 'block'}`}>
                <Select firstOption={{ label: 'Pick a title(doc name)', value: '' }} options={docOptions} onChange={(o: SelectOption | undefined) => { onChangeTitle(o); }} value={docTitle} />
              </div>
              <div className={`${(collectionKey !== undefined && collectionKey.value === '') ? 'hidden' : 'block'} flex justify-center ${(isNewCollection || isNewDoc) && 'w-full'}`}>
                <input required onChange={onChange} type="text" name="title" placeholder="new doc key" className={`input input-bordered shadow-md rounded-lg w-full max-w-xs ${isNewCollection || isNewDoc ? 'block' : 'hidden'}`} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// ADD TO FIREBASE MAIN COMPONENT
export const AddFirebase = () => {
  const [values, setValues] = useState<NewCollectionDocItemsForm>(defualtNewCollectionAndDocForm);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const items: AddCollectionAndDocuments = [{
      title: values.title,
      items: values.items,  
    }];
  };
  console.log('values:', values);
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="xl:container flex justify-center w-full h-[calc(100vh-24px)]">
        <form className="w-full p-1" onSubmit={submitHandler}>
          
          <div className="grid grid-cols-1 gap-x-3">
            
            {/* SELECT REF */}
            <div className="bg-gray-200 rounded-lg mb-2 h-36 px-1 shadow-lg ">
              <SelectDbRef
                docTitle={{ label: values.title, value: values.title }}
                collectionKey={{ label: values.collectionKey, value: values.collectionKey }} 
                onChangeKey={(collectionKey) => { collectionKey !== undefined && setValues({ ...values, collectionKey: collectionKey.value }); }}
                onChangeTitle={(title) => { title !== undefined && setValues({ ...values, title: title.value }); }}
              />
            </div>
            <div className="border-t border-gray-700 w-full mb-2 opacity-30"></div>

            {/* ADDITEM */}
            <div className="bg-gray-200 rounded-lg mb-2 px-1 shadow-lg">
              {/* {values.collectionKey && values.title ? <AddItem /> : ''} */}
              <AddItem />
            </div>   
            {/* ITEMS */}
            <div className="border border-black h-5">
              <h1>Items</h1>
              {/* render Items[] HERE */}
              {/* create a card review */}
            </div>
          </div>

          <div className="flex flex-col items-center pt-2">
            <button type="submit" className="btn w-72">save changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFirebase;
