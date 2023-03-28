import {
  ChangeEvent, memo, useEffect, useMemo, useState, 
} from 'react';
import { getCategoriesAndDocuments, getUserCollectionKeys, Keys } from '../../utils/firebase/firebase.utils';
import Select, { SelectOption } from '../select/select.component';

type SelectRefProps = {
  collectionKey: SelectOption | undefined
  docTitle: SelectOption | undefined
  onChangeKey: (collectionKey: SelectOption | undefined) => void
  onChangeTitle: (title: SelectOption | undefined) => void
};

export const SelectDbRef = ({
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
  console.log('docOptions:', docOptions)
  // fetch the collection docs title
  useEffect(() => {
    (async () => {
      if (collectionKey) {
        try {
          const collectionDocs = await getCategoriesAndDocuments(collectionKey?.label);
          const docsTitle: SelectOption[] = collectionDocs.map((doc) => {
            console.log('doc:', doc);
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
      <div className="flex justify-center text-xl pt-2 text-gray-800 mb-2 font-semibold">Data Referance</div>
      <div className="flex flex-col items-center justify-center pb-2 bg-gray-100 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2">

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
              <input onChange={onChange} type="text" name="collectionKey" placeholder="new collection key" className={`input input-bordered shadow-md rounded-lg w-full max-w-xs ${isNewCollection ? 'block' : 'hidden'}`} />
            </div>
          </div>

          <div className="flex flex-col sm:w-80 p-2">
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
                <input onChange={onChange} type="text" name="title" placeholder="new doc key" className={`input input-bordered shadow-md rounded-lg w-full max-w-xs ${isNewCollection || isNewDoc ? 'block' : 'hidden'}`} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default memo(SelectDbRef);
