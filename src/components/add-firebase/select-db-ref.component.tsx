import {
  ChangeEvent, memo, RefObject, useEffect, useState, 
} from 'react';
import {
  getUserCategories, getUserCollectionKeys, UserCollectionKeys, 
} from '../../utils/firebase/firebase.utils';
import Select, { SelectOption } from '../select/select.component';

type SelectRefProps = {
  collectionRef: RefObject<HTMLInputElement>
  titleRef: RefObject<HTMLInputElement>
  collectionKey: SelectOption | undefined
  docTitle: SelectOption | undefined
  onChangeKey: (collectionKey: SelectOption | undefined) => void
  onChangeTitle: (title: SelectOption | undefined) => void
};

export const SelectDbRef = ({
  collectionKey, docTitle, onChangeKey, onChangeTitle, collectionRef, titleRef,
}: SelectRefProps) => {
  const [isNewCollection, setIsNewCollection] = useState(false);
  const [isNewDoc, setIsNewDoc] = useState(false);

  const [userCategories, setUserCategories] = useState<Map<string, string[]> | null>(null);

  const [collectionKeysOptions, setCollectionKeysOptions] = useState<SelectOption[]>([]);
  const [docKeysOptions, setDocKeysOptions] = useState<SelectOption[]>([]);

  // fetch the collection custom keys of the user(admin)
  useEffect(() => {
    const featchUserCollectionKeys = async () => {
      try {
        const keys: UserCollectionKeys[] = await getUserCollectionKeys();
        const keysOptions: SelectOption[] = keys[0].keys.map((key) => {
          return { label: key, value: key };
        }); 
        setCollectionKeysOptions(keysOptions);
      } catch (error) {
        console.log(error);
      }
    };
    const featch = featchUserCollectionKeys();
  }, []);
  
  // featch all the user categories by userCollectionKeys
  useEffect(() => {
    const featchUserCollectionKeys = async () => {
      try {
        const keys: Map<string, string[]> = await getUserCategories();
        setUserCategories(keys);
      } catch (error) {
        console.log(error);
      }
    };
    const featch = featchUserCollectionKeys();
  }, []);

  // set sub collection keys of the chossen category by collectionKey
  useEffect(() => {
    if (collectionKey && userCategories) {
      const docsKeys = userCategories.get(collectionKey.value);
      if (docsKeys) {
        const docsTitle: SelectOption[] = docsKeys.map((key) => {
          return { label: key, value: key };
        });
        setDocKeysOptions(docsTitle);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="flex justify-center text-xl pt-2 text-gray-800 mb-2 font-semibold">Data Referance</div>
      <div className="flex flex-col items-center justify-center pb-2 bg-gray-100 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2">

          <div className="flex flex-col w-72 sm:w-80 sm:h-24 p-2">
            {/* TOGGLE BUTTON */}
            <label className="pb-1 flex justify-center ">
              <span className="label-text whitespace-nowrap pr-2 font-semibold">New collection</span>
              <input type="checkbox" onClick={() => { setIsNewCollection(!isNewCollection); }} className="toggle toggle-success" />
            </label>
            {/* INPUT VALUES */}
            <div className="flex justify-center">
              <div className={`w-full max-w-xs shadow-md rounded-lg ${isNewCollection ? 'hidden' : 'block'}`}>
                <Select firstOption={{ label: 'Pick a collection', value: '' }} options={collectionKeysOptions} onChange={(o: SelectOption | undefined) => { onChangeKey(o); }} value={collectionKey} />
              </div>
              <input ref={collectionRef} onChange={onChange} type="text" name="collectionKey" placeholder="new collection key" className={`input input-bordered shadow-md rounded-lg w-full max-w-xs ${isNewCollection ? 'block' : 'hidden'}`} />
            </div>
          </div>

          <div className="flex flex-col sm:h-20 sm:w-80 p-2">
            {/* TOGGLE BUTTON */}
            <label className={`pb-1 flex flex-grow justify-center ${(collectionKey !== undefined && collectionKey.value === '') || isNewCollection ? 'invisible' : 'visible'}`}>
              <span className="label-text whitespace-nowrap pr-2 font-semibold">New document</span>
              <input type="checkbox" onClick={() => { setIsNewDoc(!isNewDoc); }} className="toggle toggle-success" disabled={isNewCollection} />
            </label>
            {/* INPUT VALUES */}
            <div className="flex flex-grow justify-center">
              <div className={`w-full max-w-xs shadow-md rounded-lg ${(isNewCollection || isNewDoc) || (collectionKey !== undefined && collectionKey.value === '') ? 'hidden' : 'block'}`}>
                <Select firstOption={{ label: 'Pick a title(doc name)', value: '' }} options={docKeysOptions} onChange={(o: SelectOption | undefined) => { onChangeTitle(o); }} value={docTitle} />
              </div>
              <div className={`${(collectionKey !== undefined && collectionKey.value === '') ? 'hidden' : 'block'} flex justify-center ${(isNewCollection || isNewDoc) && 'w-full'}`}>
                <input ref={titleRef} onChange={onChange} type="text" name="title" placeholder="new doc key" className={`input input-bordered shadow-md rounded-lg w-full max-w-xs ${isNewCollection || isNewDoc ? 'block' : 'hidden'}`} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default memo(SelectDbRef);

