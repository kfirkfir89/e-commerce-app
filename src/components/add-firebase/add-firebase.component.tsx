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
  AddCollectionAndDocuments, getUserCollectionKeys, Keys, 
} from '../../utils/firebase/firebase.utils';
import Select, { SelectOption } from '../select/select.component';
import UploadInput from '../upload-input/upload-input.component';
import SelectColor, { SelectColorOption } from '../select-color/select-color.component';


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

export const AddFirebase = () => {
  const [values, setValues] = useState<NewCollectionDocItemsForm>(defualtNewCollectionAndDocForm);
  // const [itemValues, setItemValues] = useState<NewItem>(defualtNewItem);
  // const [stockValues, setStockValues] = useState<StockItem>(defualtStockItem);
  // one option usestate
  // const [selectedColors, setSelectedColors] = useState<SelectOption | undefined>(options[0]);
  const [selectedColors, setSelectedColors] = useState<SelectColorOption[]>([optionsColors[0]]);
  const [selectedSizes, setSelectedSizes] = useState<SelectOption[]>([optionsSizes[0]]);
  const [collectionKeys, setCollectionKeys] = useState<string[]>([]);
  const [itemUrlList, setItemUrlList] = useState<string[]>([]);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  // const urlList = useSelector((state: RootState) => state.uploadImg.urlList);
  useEffect(() => {
    (async () => {
      try {
        const keys: Keys[] = await getUserCollectionKeys();
        setCollectionKeys(keys[0].keys);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  console.log('itemUrlList:', itemUrlList)

  useEffect(() => {
    dispatch(featchCategoriesStart(values.collectionKey)); 
  }, [dispatch, values.collectionKey]);
    
  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const items: AddCollectionAndDocuments = [{
      title: values.title,
      items: values.items,  
    }];

    // addCollectionAndDocuments(values.collectionKey, items);
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onChangeItem = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  
  const selectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="container p-5 h-[calc(100vh-24px)] pt-32 overflow-auto">
        <UploadInput onChange={(urlList) => { setItemUrlList(urlList); }} />
        <form className="grid grid-cols-2 gap-2 bg-purple-300 p-2" onSubmit={submitHandler}>
          <div className="flex flex-col items-center gap-2">
            {/* <Select options={optionsSizes} onChange={(o) => { selectChange(o) }} value={selectedSizes} /> */}
            <select defaultValue="Pick a collection" name="collectionKey" onChange={selectChange} className="select w-full max-w-xs">
              <option key={0} disabled>Pick a collection</option>
              {
                collectionKeys.map((c, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <option key={i}>{c}</option>
                ))
              }
            </select>
            <select defaultValue="Pick a title(doc name)" name="title" onChange={selectChange} className="select w-full max-w-xs">
              <option key={0} disabled>Pick a title(doc name)</option>
              {
                categories.map((c, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <option key={i + 1}>{c.title}</option>
                ))
              }
            </select>
            <input onChange={onChange} type="text" name="title" placeholder="new doc key*" className="input input-bordered w-full max-w-xs" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <input onChange={onChangeItem} type="text" name="id" placeholder="id" className="input input-bordered w-full max-w-xs" />
            <input onChange={onChangeItem} type="text" name="productName" placeholder="productName" className="input input-bordered w-full max-w-xs" />
            <input onChange={onChangeItem} type="text" name="price" placeholder="price" className="input input-bordered w-full max-w-xs" />
            {/* <Select options={options} onChange={(o) => { setSelectedOptions(o); }} value={selectedOptions} /> */}
            <Select multiple options={optionsSizes} onChange={(o) => { setSelectedSizes(o); }} value={selectedSizes} />
            <SelectColor options={optionsColors} onChange={(o) => { setSelectedColors(o); }} value={selectedColors} />
            <input onChange={onChangeItem} type="text" name="stock" placeholder="stock" className="input input-bordered w-full max-w-xs" />
          </div>
          <div className="flex flex-col items-center col-span-2">
            <button type="submit" className="btn w-72">submit</button>
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
