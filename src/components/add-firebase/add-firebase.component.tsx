import {
  FormEvent, useEffect, useRef, useState, 
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  featchAddFirebaseData,
  featchAddFirebaseDataFailed,
  featchAddFirebaseDataSuccessded,
  featchAddItem,
  featchSetCollectionKey, featchSetTitleDocKey, selectAddFirebaseReducer,
} from '../../store/add-firebase/add-firebase.reducer';
import { SelectDbRef } from './select-db-ref.component';
import { AddItem, NewItemValues } from './add-item.component';
import AddItemsPreview from './add-items-preview.component';
import { addFirebaseData, setUserCollectionKeys } from '../../utils/firebase/firebase.utils';

export type AddFirebaseData = {
  collectionKey: string
  docKey: string
  items: NewItemValues[]
};
// ADD TO FIREBASE MAIN COMPONENT
export const AddFirebase = () => {
  const [isRefMissing, setIsRefMissing] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const dispatch = useDispatch();
  const addFirebaseReducer = useSelector(selectAddFirebaseReducer);
  const collectionKeyRef = useRef<HTMLInputElement>(null);
  const titleKeyRef = useRef<HTMLInputElement>(null);

  const { collectionKey, docKey, isLoading } = addFirebaseReducer;

  useEffect(() => {
    if (collectionKey !== '' && docKey !== '') {
      setIsRefMissing(false);
    }
  }, [collectionKey, docKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopUp(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showPopUp]);
 
  // add the data to the server called by the submitHandler
  async function addDataAsync(newData:AddFirebaseData) {
    try {
      const res = await addFirebaseData(newData);
      const reskey = await setUserCollectionKeys(newData.collectionKey).then(() => {
        dispatch(featchAddFirebaseDataSuccessded());
        if (collectionKeyRef.current !== null && collectionKeyRef.current !== undefined) {
          collectionKeyRef.current.value = '';
        }
        if (titleKeyRef.current !== null && titleKeyRef.current !== undefined) {
          titleKeyRef.current.value = '';
        }
        setShowPopUp(true);
      });
    } catch (error) {
      dispatch(featchAddFirebaseDataFailed(error as Error));
    }
  }

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (collectionKey === '' || docKey === '') {
      return setIsRefMissing(true);
    }
    dispatch(featchAddFirebaseData());
    
    const newData:AddFirebaseData = {
      collectionKey: addFirebaseReducer.collectionKey,
      docKey: addFirebaseReducer.docKey,
      items: addFirebaseReducer.items,
    };
    
    const res = addDataAsync(newData);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="xl:container flex justify-center w-full">
        <form className="w-full p-1" onSubmit={submitHandler}> 
          <div className="grid grid-cols-1 gap-x-3">
            {/* popup after sucsses */}
            {showPopUp && (
            <div className="flex flex-col">
              <div className="alert alert-warning bg-green-200 shadow-lg flex flex-col my-2">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>Your data has been updated!</span>
                </div>
              </div>     
            </div>
            )}
            {/* SELECT REF */}
            <div className="bg-gray-200 rounded-lg mb-2 pb-4 px-1 shadow-lg ">
              {isRefMissing && (
              <div className="flex flex-col">
                <div className="alert alert-warning bg-yellow-200 shadow-lg flex flex-col my-2">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>Warning: Invalid collection and document</span>
                  </div>
                </div>     
              </div>
              )}
              <SelectDbRef
                titleRef={titleKeyRef}
                collectionRef={collectionKeyRef}
                docTitle={{ label: docKey, value: docKey }}
                collectionKey={{ label: collectionKey, value: collectionKey }} 
                onChangeKey={(collectionKey) => { collectionKey !== undefined && dispatch(featchSetCollectionKey(collectionKey.value)); }}
                onChangeTitle={(docKey) => { docKey !== undefined && dispatch(featchSetTitleDocKey(docKey.value)); }}
              />
            </div>
            {/* ADDITEM */}
            <div className="bg-gray-200 rounded-lg my-2 shadow-lg">
              {collectionKey && docKey ? <AddItem onAddItem={(newItem) => { dispatch(featchAddItem(newItem)); }} /> : ''}
            </div>   
            {/* ITEMS */}
            <div className="bg-gray-200 rounded-lg my-2 pb-2 shadow-lg">
              <AddItemsPreview />
            </div>
          </div>
          {/* SUBMIT BUTTON */}
          <div className="md:col-span-3 flex flex-col w-full pb-8">
            <div className="divider mx-4"></div>
            <div className="flex justify-center">
              <button type="submit" className={`btn btn-accent ${isLoading ? 'loading' : ''} mx-2 px-20 text-gray-700`}>save changes</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFirebase;
