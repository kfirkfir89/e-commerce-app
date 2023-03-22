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
const optionsSizes: SelectOption[] = [
  { label: '36', value: '36' },
  { label: '37', value: '37' },
  { label: '38', value: '38' },
  { label: '39', value: '39' },
  { label: '40', value: '40' },
  { label: '41', value: '41' },
  { label: '42', value: '42' },
  { label: '43', value: '43' },
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
};


// STOCK COMPONENT
type AddItemStockProps = {
  colors: SelectColorOption[]
  sizes: SelectOption[]
  onChange: (ItemStock: SizeStock[]) => void
};

const AddItemStock = ({ onChange, colors, sizes }: AddItemStockProps) => {
  const [stock, setStock] = useState<SizeStock[]>([]);

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

  return (
    <div className="flex flex-col max-w-xs bg-white p-1 shadow-lg rounded-lg">
      {stock.map((item) => {
        return (
          <div key={`${item.size}`} className="flex p-2 my-2 shadow-lg rounded-lg bg-gray-200">

            <div className="flex justify-center items-center bg-white p-1 shadow-lg h-7 w-7 rounded-lg font-semibold">
              {item.size}
            </div>

            <div className="flex flex-wrap">
              { item.colors
                && item.colors.map((c) => {
                  return (
                    <div key={`${c.label}button`} className="flex px-1 pb-1">
                      <div className="flex justify-center items-center bg-white p-1 px-2 shadow-lg h-7 w-7 rounded-lg">
                        <button
                          className=""
                          name={c.label}
                          onClick={() => {
                            // Find the index of the selected size in the stock state
                            const sizeIndex = stock.findIndex((s) => s.size === item.size);
                            if (stock[sizeIndex].colors === undefined) return;
                            // Find the index of the selected color in the colors array of the selected size
                            const colorIndex = stock[sizeIndex].colors?.findIndex((color) => color.label === c.label);

                            // Update the count of the selected color
                            const updatedStock = [...stock];
                            updatedStock[sizeIndex].colors[colorIndex].count += 1;

                            // Update the state with the updated stock
                            setStock(updatedStock);
                          }}
                        >
                          <AddIcon className="opacity-30" />
                        </button>
                      </div>
                      <div className={`${c.value} p-1 px-2 shadow-lg h-7 w-7 rounded-lg`}>
                        {c.count}
                      </div>
                      <div className="flex justify-center items-center bg-white p-1 px-2 shadow-lg h-7 w-7 rounded-lg">
                        <button
                          className=""
                          name={c.label}
                          onClick={() => {
                          // Find the index of the selected size in the stock state
                            const sizeIndex = stock.findIndex((s) => s.size === item.size);
                            if (stock[sizeIndex].colors === undefined) return;
                            // Find the index of the selected color in the colors array of the selected size
                            const colorIndex = stock[sizeIndex].colors?.findIndex((color) => color.label === c.label);
                            // Check if the count is already zero
                            if (stock[sizeIndex].colors[colorIndex].count === 0) return;
                            // Update the count of the selected color
                            const updatedStock = [...stock];
                            updatedStock[sizeIndex].colors[colorIndex].count -= 1;

                            // Update the state with the updated stock
                            setStock(updatedStock);
                          }}
                        >
                          <RemoveIcon className="opacity-30" />
                        </button>
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
  // const [imgFileList, setImgFileList] = useState<ImageColorsFiles[]>([]);
  const {
    colors, sizes,
  } = addItemValues;
  const dispatch = useDispatch();

  console.log('addItemValues:', addItemValues);
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
  // prevent input number to except the following chars
  const exceptThisSymbols = ['e', 'E', '+', '-', '.'];
  return (
    <div className="flex flex-col p-2">
      {/* title */}
      <div className="flex justify-center text-xl pb-2 text-gray-800 font-semibold">New Item</div>
      {/* error handling */}
      {isError.length > 0 && (
        <div className="flex flex-col">
          <div className="alert alert-warning shadow-lg flex flex-col my-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">

        <div className="flex flex-col justify-center items-center ">
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
              <span className="label-text">Size</span>
            </label>
            <Select multiple firstOption={{ label: 'Select Size', value: '' }} options={optionsSizes} onChange={(objSizes) => { setAddItemValues({ ...addItemValues, sizes: objSizes }); }} value={addItemValues.sizes} />
          </div>
          <div className="w-full max-w-xs">
            <label className="label pb-1">
              <span className="label-text">Color</span>
            </label>
            <SelectColor firstOption={{ label: 'Select Color', value: '' }} options={optionsColors} onChange={(objColors) => { setAddItemValues({ ...addItemValues, colors: objColors }); }} value={addItemValues.colors} />
          </div>
          {/* STOCK COMPONENT */}
          {Array.isArray(addItemValues.sizes) && addItemValues.sizes.length !== 0
            && (
              <div className="w-full max-w-xs">
                <label className="label pb-1">
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
          
        <div className="">          
          {
              colors.map((color) => {
                return (
                  color.label === 'nocolor' ? (
                    <div key={color.label} className="p-2 mt-2 shadow-lg rounded-lg">
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
                    <div key={color.label} className={`${color.value} p-2 mt-2 shadow-lg rounded-lg`}>
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

        <div className="md:col-span-2 flex flex-col">
          <div className="border-t border-gray-700 w-full my-2 opacity-30"></div>
          <div className="flex justify-end">
            <button className="btn btn-accent btn-sm text-gray-700" onClick={errorChecker}>Create Item</button>
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
  const [isExsitingCollection, setIsExsitingCollection] = useState(false);
  const [isNewDoc, setIsNewDoc] = useState(false);
  const [isExsitingDoc, setIsExsitingDoc] = useState(false);

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
    <div className="grid grid-cols-1">
      <div className="p-2">
        <div className="flex justify-center text-xl text-gray-800 font-semibold pb-2">Data Referance</div>
        <div className="flex justify-center mb-2 btn-group lg:btn-group-horizontal">
          <button className="btn btn-accent btn-xs" onClick={() => { setIsNewCollection(true); setIsExsitingCollection(false); }}>new collection</button>
          <button className="btn btn-accent btn-xs" onClick={() => { setIsExsitingCollection(true); setIsNewCollection(false); }}>exsiting collection</button>
        </div>
        {isNewCollection
            && (
            <div className="flex justify-center items-center flex-col gap-2 w-full">
              <input required onChange={onChange} type="text" name="collectionKey" placeholder="new collection key" className="input input-bordered w-full max-w-xs" />
              <input required onChange={onChange} type="text" name="title" placeholder="new doc key(title)" className="input input-bordered w-full max-w-xs" />
            </div>
            )}
        {isExsitingCollection
            && (
            <div className="flex flex-col justify-center items-center gap-2 w-full">
              <Select firstOption={{ label: 'Pick a collection', value: '' }} options={memoizedKeysOptions} onChange={(o: SelectOption | undefined) => { onChangeKey(o); }} value={collectionKey} />
              <div className="flex btn-group lg:btn-group-horizontal pt-2">
                <button className="btn btn-accent btn-xs" onClick={() => { setIsNewDoc(true); setIsExsitingDoc(false); }}>new document</button>
                <button className="btn btn-accent btn-xs" onClick={() => { setIsExsitingDoc(true); setIsNewDoc(false); }}>exsiting document</button>
              </div>
              {
                isNewDoc && <input required onChange={onChange} type="text" name="title" placeholder="new doc key(title)" className="input input-bordered w-full max-w-xs" />
              }
              {
                isExsitingDoc && <Select firstOption={{ label: 'Pick a title(doc name)', value: '' }} options={docOptions} onChange={(o: SelectOption | undefined) => { onChangeTitle(o); }} value={docTitle} />
              }
            </div>
            )}       
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

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="xl:container flex justify-center w-full bg-red-700 h-[calc(100vh-24px)]">
        <form className="bg-purple-300 w-full mx-2 p-2" onSubmit={submitHandler}>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3">
            
            {/* SELECT REF */}
            <div className="bg-gray-300">
              <SelectDbRef
                docTitle={{ label: values.title, value: values.title }}
                collectionKey={{ label: values.collectionKey, value: values.collectionKey }} 
                onChangeKey={(collectionKey) => { collectionKey !== undefined && setValues({ ...values, collectionKey: collectionKey.value }); }}
                onChangeTitle={(title) => { title !== undefined && setValues({ ...values, title: title.value }); }}
              />
            </div>

            {/* ADDITEM */}
            <div className="bg-yellow-300 sm:col-span-2">
              {/* {values.collectionKey && values.title ? <AddItem /> : ''} */}
              <AddItem />
            </div>   
            {/* ITEMS */}
            <div className="border border-black h-5 sm:col-span-3">
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
