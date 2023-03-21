import {
  ChangeEvent, FormEvent, useEffect, useState, useMemo, useRef, useCallback, 
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
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
    <div className="flex flex-col max-w-xs bg-white p-1 mt-20 shadow-lg rounded-lg">
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
const AddItem = () => {
  const [addItemValues, setAddItemValues] = useState<ItemValues>(defualtItemValues);
  const [isError, setIsError] = useState<Error | null>(null);
  // const [imgFileList, setImgFileList] = useState<ImageColorsFiles[]>([]);
  const {
    colors, sizes,
  } = addItemValues;
  const dispatch = useDispatch();

  console.log('addItemValues:', isError);
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

  const submitItemHandler = () => {
    // upload the image here
    // addItemValues.imgFileList.map((listImgColors) => (
    //   UploadAsync(listImgColors)
    // ));
    if (Array.isArray(addItemValues.stock) && addItemValues.stock.length === 0) {
      setIsError(new Error('Upload image for the choosen color'));
    }
    if (Array.isArray(addItemValues.imgFileList) && addItemValues.imgFileList.length === 0) {
      setIsError(new Error('Upload image for the choosen color'));
    }
    if (Array.isArray(addItemValues.sizes) && addItemValues.sizes.length === 0) {
      setIsError(new Error('Size must be choose'));
    }
    if (Array.isArray(addItemValues.sizes) && addItemValues.sizes.length === 0) {
      setIsError(new Error('Size must be choose'));
    }
    if (Array.isArray(addItemValues.colors) && addItemValues.colors.length === 0) {
      setIsError(new Error('Color must be choose or no-color option'));
    }
    if (addItemValues.productName === '' || addItemValues.price === 0) {
      setIsError(new Error('You must enter product name and price'));
    }
  };
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
    <div className="flex flex-col items-center gap-2">
      {isError && <span className="text-2xl font-semibold text-red-700">{isError.message}</span>}
      {/* <FormInput type="text" name="id" placeholder="Id" label="Id" onChange={onChange} required errorMessage="Price can't be 0" /> */}
      <FormInput type="text" name="productName" placeholder="Product Name" label="ProductName" pattern="^[A-Za-z0-9]{3,50}$" onChange={onChange} required errorMessage="Enter product name" />
      <FormInput onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()} type="number" name="price" placeholder="Price" label="Price" min="0" onChange={onChange} required errorMessage="Price can't be 0" />
      <Select multiple firstOption={{ label: 'Select Size', value: '' }} options={optionsSizes} onChange={(objSizes) => { setAddItemValues({ ...addItemValues, sizes: objSizes }); }} value={addItemValues.sizes} />
      <SelectColor firstOption={{ label: 'Select Color', value: '' }} options={optionsColors} onChange={(objColors) => { setAddItemValues({ ...addItemValues, colors: objColors }); }} value={addItemValues.colors} />
      {
        colors.map((color) => {
          return (
            color.label === 'nocolor' ? (
              <div key={color.label} className="p-2 shadow-lg rounded-lg">
                <div>
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
              </div>
            ) : (      
              <div key={color.label} className={`${color.value} p-2 shadow-lg rounded-lg`}>
                <div>
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
              </div>
            )
          );
        })
      }

      {/* STOCK COMPONENT */}
      
      <AddItemStock
        onChange={(ItemStock) => { 
          setAddItemValues(() => ({ ...addItemValues, stock: ItemStock })); 
        }}
        colors={colors}
        sizes={sizes}
      />
      <button className="btn btn-ghost" onClick={submitItemHandler}>Create Product</button>
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
    <div className="grid grid-cols-1 place-items-center gap-2">
      <div className="flex">
        <button className="btn btn-ghost btn-xs" onClick={() => { setIsNewCollection(true); }}>new collection</button>
        <button className="btn btn-ghost btn-xs" onClick={() => { setIsNewCollection(false); }}>exsiting collection</button>
      </div>
      {isNewCollection
        ? (
          <>
            <input required onChange={onChange} type="text" name="collectionKey" placeholder="new collection key" className="input input-bordered w-full max-w-xs" />
            <input required onChange={onChange} type="text" name="title" placeholder="new doc key(title)" className="input input-bordered w-full max-w-xs" />
          </>
        )
        : (

          <>
            <Select firstOption={{ label: 'Pick a collection', value: '' }} options={memoizedKeysOptions} onChange={(o: SelectOption | undefined) => { onChangeKey(o); }} value={collectionKey} />
            <div className="flex">
              <button className="btn btn-ghost btn-xs" onClick={() => { setIsNewDoc(true); }}>new doc</button>
              <button className="btn btn-ghost btn-xs" onClick={() => { setIsNewDoc(false); }}>exsiting doc</button>
            </div>
            {
            isNewDoc 
              ? <input required onChange={onChange} type="text" name="title" placeholder="new doc key(title)" className="input input-bordered w-full max-w-xs" />
              : <Select firstOption={{ label: 'Pick a title(doc name)', value: '' }} options={docOptions} onChange={(o: SelectOption | undefined) => { onChangeTitle(o); }} value={docTitle} />
          }
          </>
        )}            
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
      <div className="container p-5 h-[calc(100vh-24px)] pt-32 overflow-auto">
        <form className="bg-purple-300 p-2" onSubmit={submitHandler}>
          <div className="grid grid-cols-1">
            
            {/* SELECT REF */}
            <SelectDbRef docTitle={{ label: values.title, value: values.title }} collectionKey={{ label: values.collectionKey, value: values.collectionKey }} onChangeKey={(collectionKey) => { collectionKey !== undefined && setValues({ ...values, collectionKey: collectionKey.value }); }} onChangeTitle={(title) => { title !== undefined && setValues({ ...values, title: title.value }); }} />

            {/* ADDITEM */}
            <AddItem />
            
            {/* ITEMS */}
            <br />
            <div className=" flex justify-center border border-black h-5">
              <h1>Items</h1>
              {/* render Items[] HERE */}
              {/* create a card review */}
            </div>
          </div>
          <div className="flex flex-col items-center col-span-2 pt-2">
            <button type="submit" className="btn w-72">save changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFirebase;
