import {
  ChangeEvent, FormEvent, useEffect, useState, useMemo, 
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import { NewCollectionDocItemsForm, NewItem, StockItem } from '../../store/add-firebase/add-firebase.reducer';
import { featchCategoriesStart } from '../../store/categories/category.action';
import { selectCategories } from '../../store/categories/category.selector';
import { RootState } from '../../store/store';
import {
  AddCollectionAndDocuments, getCategoriesAndDocuments, getUserCollectionKeys, Keys, 
} from '../../utils/firebase/firebase.utils';
import Select, { SelectOption } from '../select/select.component';
import UploadInput from '../upload-input/upload-input.component';
import SelectColor, { SelectColorOption } from '../select-color/select-color.component';
import { ReactComponent as NoColorIcon } from '../../assets/format_color_reset.svg';
import { ReactComponent as AddIcon } from '../../assets/add_FILL0.svg';
import { ReactComponent as RemoveIcon } from '../../assets/remove_FILL0.svg';


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
  { label: '41', value: '44' },
  { label: '42', value: 'Blue' },
  { label: '43', value: 'Green' },
  { label: '44', value: 'Black' },
  { label: '45', value: 'Red2' },
  { label: '46', value: 'Blue2' },
  { label: 'green2', value: 'Green2' },
  { label: 'black2', value: 'Black2' },
];

const optionsColors: SelectColorOption[] = [
  { label: 'red', value: 'bg-sky-500' },
  { label: 'blue', value: 'bg-slate-500' },
  { label: 'green', value: 'bg-gray-500' },
  { label: 'black', value: 'bg-zinc-500' },
  { label: 'red2', value: 'bg-red-500' },
  { label: 'blue2', value: 'bg-green-500' },
  { label: 'green2', value: 'bg-yellow-500' },
  { label: 'black2', value: 'bg-blue-500' },
];

type ColorStock = { label: string, value: string, count: number };
type SizeStock = {
  size: string
  colors: ColorStock[]
};

const AddItem = () => {
  const [values, setValues] = useState<NewCollectionDocItemsForm>(defualtNewCollectionAndDocForm);
  const [selectedColors, setSelectedColors] = useState<SelectColorOption[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<SelectOption[]>([]);
  const [itemUrlList, setItemUrlList] = useState<string[]>([]);
  const [stock, setStock] = useState<SizeStock[]>([]);
  
  useEffect(() => {
    const noColorOption: ColorStock = { label: 'nocolor', value: 'nocolor', count: 0 };
    const initialStock: SizeStock[] = selectedSizes.map((s) => {
      return { size: s.label, colors: selectedColors.map((c) => { return { label: c.label, value: c.value, count: 0 }; }) };
    });
    initialStock.map((item) => {
      return item.colors?.push(noColorOption);
    });
    setStock(initialStock);
    console.log(initialStock);
  }, [selectedColors, selectedSizes]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input onChange={onChange} type="text" name="id" placeholder="id" className="input input-bordered w-full max-w-xs" />
      <input onChange={onChange} type="text" name="productName" placeholder="productName" className="input input-bordered w-full max-w-xs" />
      <input onChange={onChange} type="text" name="price" placeholder="price" className="input input-bordered w-full max-w-xs" />

      <Select multiple options={optionsSizes} onChange={(o) => { setSelectedSizes(o); }} value={selectedSizes} />
      <SelectColor options={optionsColors} onChange={(o) => { setSelectedColors(o); }} value={selectedColors} />
      <div className="flex flex-col max-w-xs bg-white p-1 shadow-lg rounded-lg">
        {stock.map((item) => {
          return (
            <div key={`${item.size + v4()}`} className="flex p-2 my-2 shadow-lg rounded-lg bg-gray-200">

              <div className="flex justify-center items-center bg-white p-1 shadow-lg h-7 w-7 rounded-lg font-semibold">
                {item.size}
              </div>

              <div className="flex flex-wrap">
                { item.colors
                    && item.colors.map((c) => {
                      return (
                        <div key={`${c.label + v4()}`} className="flex px-1 pb-1">

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
                            <button>
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

      <UploadInput onChange={(urlList) => { setItemUrlList(urlList); }} />
    </div>
  );
};

export const AddFirebase = () => {
  const [values, setValues] = useState<NewCollectionDocItemsForm>(defualtNewCollectionAndDocForm);
  const [collectionKey, setCollectionKey] = useState<SelectOption | undefined>(undefined);
  const [docTitle, setDocTitle] = useState<SelectOption | undefined>(undefined);


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

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const items: AddCollectionAndDocuments = [{
      title: values.title,
      items: values.items,  
    }];
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="container p-5 h-[calc(100vh-24px)] pt-32 overflow-auto">
        <form className="bg-purple-300 p-2" onSubmit={submitHandler}>
          <div className="grid grid-cols-1">

            {/* SELECT REF */}
            <div className="grid grid-cols-1 place-items-center gap-2">
              <div className="flex">
                <button className="btn btn-ghost btn-xs" onClick={() => { setIsNewCollection(true); }}>new collection</button>
                <button className="btn btn-ghost btn-xs" onClick={() => { setIsNewCollection(false); }}>exsiting collection</button>
              </div>
              {isNewCollection
                ? (
                  <>
                    <input required onChange={onChange} type="text" name="title" placeholder="new collection key" className="input input-bordered w-full max-w-xs" />
                    <input required onChange={onChange} type="text" name="title" placeholder="new doc key(title)" className="input input-bordered w-full max-w-xs" />
                  </>
                )
                : (

                  <>
                    <Select firstOption={{ label: 'Pick a collection', value: 'Pick a collection' }} options={memoizedKeysOptions} onChange={(o: SelectOption | undefined) => { setCollectionKey(o); }} value={collectionKey} />
                    <div className="flex">
                      <button className="btn btn-ghost btn-xs" onClick={() => { setIsNewDoc(true); }}>new doc</button>
                      <button className="btn btn-ghost btn-xs" onClick={() => { setIsNewDoc(false); }}>exsiting doc</button>
                    </div>
                    {
                      isNewDoc 
                        ? <input required onChange={onChange} type="text" name="title" placeholder="new doc key(title)" className="input input-bordered w-full max-w-xs" />
                        : <Select firstOption={{ label: 'Pick a title(doc name)', value: 'Pick a title(doc name)' }} options={docOptions} onChange={(o: SelectOption | undefined) => { setDocTitle(o); }} value={docTitle} />
                    }
                  </>
                )}            
            </div>

            {/* ADDITEM */}
            <div className="flex justify-center pt-2">
              <h1>Add new items</h1>
            </div>
            <AddItem />
            {/* ITEMS */}
            <br />
            <div className="flex justify-center">
              <h1>Items</h1>
            </div>
            <div className="border border-black h-5">
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
/* 
item
{
  id
  productName
  images
  price
  size
  colors
  
  stock[
    {size, color, supply},
    {size, color, supply},
  ]
}

{
  hats: {
    title: 'Hats',
    items: [
      {item},
      {item}
    ]
  },
  sneakers: {
    title: 'Sneakers',
    items: [
      {},
      {}
    ]
  }
}
 */
