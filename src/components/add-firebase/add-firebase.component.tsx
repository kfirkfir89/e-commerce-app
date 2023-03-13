import {
  ChangeEvent, FormEvent, useEffect, useState, 
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { featchCategoriesStart } from '../../store/categories/category.action';
import { selectCategories } from '../../store/categories/category.selector';
import { CategoryItem } from '../../store/categories/category.types';
import { AddCollectionAndDocuments, addCollectionAndDocuments } from '../../utils/firebase/firebase.utils';
import Select, { SelectOption } from '../select/select.component';
import UploadInput from '../upload-input/upload-input.component';

type NewCollectionAndDocForm = {
  collectionKey: string;
  title: string;
  items: CategoryItem[];
};

type StockItem = {
  size: string | number;
  color?: string;
  supply: number;
};

type NewItem = {
  id: string;
  imageUrl: string[];
  productName: string;
  price: 0;
  sizes: string[] | number[];
  colors?: string[];
  stock: StockItem[];
};


const defualtNewCollectionAndDocForm: NewCollectionAndDocForm = {
  collectionKey: '',
  title: '',
  items: [],
};

const defualtNewItem: NewItem = {
  id: '',
  imageUrl: [],
  productName: '',
  price: 0,
  sizes: [],
  colors: undefined,
  stock: [],
};

const defualtStockItem: StockItem = {
  size: '',
  color: '',
  supply: 0,
};

const optionsSizes = [
  { label: 'red', value: 'Red' },
  { label: 'blue', value: 'Blue' },
  { label: 'green', value: 'Green' },
  { label: 'black', value: 'Black' },
  { label: 'red2', value: 'Red2' },
  { label: 'blue2', value: 'Blue2' },
  { label: 'green2', value: 'Green2' },
  { label: 'black2', value: 'Black2' },
];

const optionsColors = [
  { label: '41', value: '44' },
  { label: '42', value: 'Blue' },
  { label: '43', value: 'Green' },
  { label: '44', value: 'Black' },
  { label: '45', value: 'Red2' },
  { label: '46', value: 'Blue2' },
  { label: 'green2', value: 'Green2' },
  { label: 'black2', value: 'Black2' },
];

export const AddFirebase = () => {
  const [values, setValues] = useState<NewCollectionAndDocForm>(defualtNewCollectionAndDocForm);
  const [itemValues, setItemValues] = useState<NewItem>(defualtNewItem);
  const [stockValues, setStockValues] = useState<StockItem>(defualtStockItem);
  // one option usestate
  // const [selectedColors, setSelectedColors] = useState<SelectOption | undefined>(options[0]);
  const [selectedColors, setSelectedColors] = useState<SelectOption[]>([optionsColors[0]]);
  const [selectedSizes, setSelectedSizes] = useState<SelectOption[]>([optionsSizes[0]]);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(featchCategoriesStart(values.collectionKey)); 
    console.log('FORM:', categories);   
  }, []);
    
  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const items: AddCollectionAndDocuments = [{
      title: values.title,
      items: values.items,  
    }];

    addCollectionAndDocuments(values.collectionKey, items);
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
        <UploadInput />
        <form className="grid grid-cols-2 gap-2 bg-purple-300 p-2" onSubmit={submitHandler}>
          <div className="flex flex-col items-center gap-2">
            <select name="collectionKey" onChange={selectChange} className="select w-full max-w-xs">
              <option key={1}>boys</option>
              <option key={2}>girls</option>
              <option key={3}>categories</option>
              <option disabled selected>Pick a collection</option>
            </select>
            <select name="title" onChange={selectChange} className="select w-full max-w-xs">
              {
                      categories.map((c, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <option key={i}>{c.title}</option>
                      ))
                    }
              <option disabled selected>Pick a title(doc name)</option>
            </select>
            <input onChange={onChange} type="text" name="title" placeholder="new doc key*" className="input input-bordered w-full max-w-xs" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <input onChange={onChangeItem} type="text" name="id" placeholder="id" className="input input-bordered w-full max-w-xs" />
            <input onChange={onChangeItem} type="text" name="productName" placeholder="productName" className="input input-bordered w-full max-w-xs" />
            <input onChange={onChangeItem} type="text" name="imageUrl" placeholder="imageUrl" className="input input-bordered w-full max-w-xs" />
            <input onChange={onChangeItem} type="text" name="price" placeholder="price" className="input input-bordered w-full max-w-xs" />
            <input onChange={onChangeItem} type="text" name="size" placeholder="size" className="input input-bordered w-full max-w-xs" />
            {/* <Select options={options} onChange={(o) => { setSelectedOptions(o); }} value={selectedOptions} /> */}
            <Select multiple options={optionsSizes} onChange={(o) => { setSelectedSizes(o); }} value={selectedSizes} />
            <Select multiple options={optionsColors} onChange={(o) => { setSelectedColors(o); }} value={selectedColors} />
            <input onChange={onChangeItem} type="text" name="colors" placeholder="colors" className="input input-bordered w-full max-w-xs" />
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
