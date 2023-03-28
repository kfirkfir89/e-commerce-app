import {
  FormEvent, 
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  featchAddItem,
  featchSetCollectionKey, featchSetTitleDocKey, selectAddFirebaseReducer,
} from '../../store/add-firebase/add-firebase.reducer';
import { SelectDbRef } from './select-db-ref.component';
import { AddItem, NewItemValues } from './add-item.component';
import Items from './items.component';
import { addFirebaseData } from '../../utils/firebase/firebase.utils';

export type AddFirebaseData = {
  collectionKey: string
  title: string
  items: NewItemValues[]
};
// ADD TO FIREBASE MAIN COMPONENT
export const AddFirebase = () => {
  const dispatch = useDispatch();
  const addFirebaseReducer = useSelector(selectAddFirebaseReducer);

  const { collectionKey, title } = addFirebaseReducer;

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newData:AddFirebaseData = {
      collectionKey: addFirebaseReducer.collectionKey,
      title: addFirebaseReducer.title,
      items: addFirebaseReducer.items,
    };
    addFirebaseData(newData);
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="xl:container flex justify-center w-full h-[calc(100vh-24px)]">
        <form className="w-full p-1" onSubmit={submitHandler}> 
          <div className="grid grid-cols-1 gap-x-3">
            {/* SELECT REF */}
            <div className="bg-gray-200 rounded-lg mb-2 pb-4 px-1 shadow-lg ">
              <SelectDbRef
                docTitle={{ label: title, value: title }}
                collectionKey={{ label: collectionKey, value: collectionKey }} 
                onChangeKey={(collectionKey) => { collectionKey !== undefined && dispatch(featchSetCollectionKey(collectionKey.value)); }}
                onChangeTitle={(title) => { title !== undefined && dispatch(featchSetTitleDocKey(title.value)); }}
              />
            </div>
            {/* ADDITEM */}
            <div className="bg-gray-200 rounded-lg my-2 shadow-lg">
              {collectionKey && title ? <AddItem onAddItem={(newItem) => { dispatch(featchAddItem(newItem)); }} /> : ''}
            </div>   
            {/* ITEMS */}
            <div className="bg-gray-200 rounded-lg my-2 pb-2 shadow-lg">
              <Items />
            </div>
          </div>
          {/* SUBMIT BUTTON */}
          <div className="md:col-span-3 flex flex-col w-full pb-8">
            <div className="border-t border-gray-700 m-4 opacity-30"></div>
            <div className="flex justify-center">
              <button type="submit" className="btn btn-accent mx-2 px-20 text-gray-700">save changes</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFirebase;
