import { FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  featchAddFirebaseData,
  featchAddFirebaseDataFailed,
  featchAddFirebaseDataSuccessded,
  featchAddItem,
  featchSetCollectionKey,
  featchSetSortOption,
  featchSetTitleDocKey,
  selectAddFirebaseReducer,
} from '../../store/add-firebase/add-firebase.reducer';
import { SelectDbRef } from './select-db-ref.component';
import { AddItem, NewItemValues } from './add-item.component';
import AddItemsPreview from './add-items-preview.component';
import {
  addFirebaseData,
  setUserCollectionKeys,
} from '../../utils/firebase/firebase.utils';
import { SelectOption } from '../select/select.component';

export type AddFirebaseData = {
  collectionKey: string;
  docKey: string;
  items: NewItemValues[];
  sizeSortOption: SelectOption;
};
// ADD TO FIREBASE MAIN COMPONENT
export const AddFirebase = () => {
  const [isRefMissing, setIsRefMissing] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const dispatch = useDispatch();
  const addFirebaseReducer = useSelector(selectAddFirebaseReducer);
  const collectionKeyRef = useRef<HTMLInputElement>(null);
  const titleKeyRef = useRef<HTMLInputElement>(null);

  const { collectionKey, docKey, isLoading, sizeSortOption } =
    addFirebaseReducer;

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
  async function addDataAsync(newData: AddFirebaseData) {
    try {
      const res = await addFirebaseData(newData);
      const reskey = await setUserCollectionKeys(newData.collectionKey).then(
        () => {
          dispatch(featchAddFirebaseDataSuccessded());
          if (
            collectionKeyRef.current !== null &&
            collectionKeyRef.current !== undefined
          ) {
            collectionKeyRef.current.value = '';
          }
          if (
            titleKeyRef.current !== null &&
            titleKeyRef.current !== undefined
          ) {
            titleKeyRef.current.value = '';
          }
          setShowPopUp(true);
        }
      );
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

    const newData: AddFirebaseData = {
      collectionKey: addFirebaseReducer.collectionKey,
      docKey: addFirebaseReducer.docKey,
      items: addFirebaseReducer.items,
      sizeSortOption: addFirebaseReducer.sizeSortOption,
    };

    const res = addDataAsync(newData);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full justify-center xl:container">
        <form className="w-full p-1" onSubmit={submitHandler}>
          <div className="grid grid-cols-1 gap-x-3">
            {/* popup after sucsses */}
            {showPopUp && (
              <div className="flex flex-col">
                <div className="alert alert-warning my-2 flex flex-col bg-green-200 shadow-lg">
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
                    <span>Your data has been updated!</span>
                  </div>
                </div>
              </div>
            )}
            {/* SELECT REF */}
            <div className="mb-2 rounded-lg bg-gray-200 px-1 pb-4 shadow-lg ">
              {isRefMissing && (
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
                onChangeSelectSizeOption={(selecSizeOption) => {
                  selecSizeOption !== undefined &&
                    dispatch(featchSetSortOption(selecSizeOption));
                }}
                sizeOption={sizeSortOption}
                onChangeKey={(collectionKey) => {
                  collectionKey !== undefined &&
                    dispatch(featchSetCollectionKey(collectionKey.value));
                }}
                onChangeTitle={(docKey) => {
                  docKey !== undefined &&
                    dispatch(featchSetTitleDocKey(docKey.value));
                }}
              />
            </div>
            {/* ADDITEM */}
            <div className="my-2 rounded-lg bg-gray-200 shadow-lg">
              {collectionKey && docKey && sizeSortOption.value !== '' ? (
                <AddItem
                  onAddItem={(newItem) => {
                    dispatch(featchAddItem(newItem));
                  }}
                />
              ) : (
                ''
              )}
            </div>
            {/* ITEMS */}
            <div className="my-2 rounded-lg bg-gray-200 pb-2 shadow-lg">
              <AddItemsPreview />
            </div>
          </div>
          {/* SUBMIT BUTTON */}
          <div className="flex w-full flex-col pb-8 md:col-span-3">
            <div className="divider mx-4"></div>
            <div className="flex justify-center">
              <button
                type="submit"
                className={`btn-accent btn ${
                  isLoading ? 'loading' : ''
                } mx-2 px-20 text-gray-700`}
              >
                save changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFirebase;
