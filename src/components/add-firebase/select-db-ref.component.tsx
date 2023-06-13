import {
  ChangeEvent,
  memo,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  getUserCollectionKeys,
  UserCollectionKeys,
} from '../../utils/firebase/firebase.utils';
import Select, { SelectOption } from '../select/select.component';
import { getUserCategories } from '../../utils/firebase/firebase.category.utils';

type SelectRefProps = {
  collectionRef: RefObject<HTMLInputElement>;
  titleRef: RefObject<HTMLInputElement>;
  collectionKey: SelectOption | undefined;
  docTitle: SelectOption | undefined;
  sizeOption: SelectOption | undefined;
  onChangeSelectSizeOption: (option: SelectOption | undefined) => void;
  onChangeKey: (collectionKey: SelectOption | undefined) => void;
  onChangeTitle: (title: SelectOption | undefined) => void;
};

const options: SelectOption[] = [
  { label: 'shirts', value: 'shirts' },
  { label: 'pants', value: 'pants' },
  { label: 'shoes', value: 'shoes' },
  { label: 'global', value: 'global' },
];

export const SelectDbRef = ({
  collectionKey,
  docTitle,
  onChangeKey,
  onChangeTitle,
  collectionRef,
  titleRef,
  onChangeSelectSizeOption,
  sizeOption,
}: SelectRefProps) => {
  const [isNewCollection, setIsNewCollection] = useState(false);
  const [isNewDoc, setIsNewDoc] = useState(false);

  const [userCategories, setUserCategories] = useState<Map<
    string,
    string[]
  > | null>(null);

  const [collectionKeysOptions, setCollectionKeysOptions] = useState<
    SelectOption[]
  >([]);
  const [docKeysOptions, setDocKeysOptions] = useState<SelectOption[]>([]);

  // fetch the collection custom keys of the user(admin)
  useEffect(() => {
    const featchUserCollectionKeys = async () => {
      try {
        const keys = await getUserCollectionKeys();
        const keysOptions: SelectOption[] = keys.map((key) => {
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
  // set new collection and docs values
  useEffect(() => {
    onChangeTitle({ label: '', value: '' });
    onChangeKey({ label: '', value: '' });
    if (titleRef.current) {
      // eslint-disable-next-line no-param-reassign
      titleRef.current.value = '';
    }
    if (collectionRef.current) {
      // eslint-disable-next-line no-param-reassign
      collectionRef.current.value = '';
    }
    if (isNewCollection) {
      setIsNewDoc(true);
    } else {
      setIsNewDoc(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewCollection]);

  useEffect(() => {
    if (!isNewDoc) {
      if (titleRef.current) {
        // eslint-disable-next-line no-param-reassign
        titleRef.current.value = '';
      }
      onChangeTitle({ label: '', value: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewDoc]);

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
      <div className="mb-2 flex justify-center pt-2 text-xl font-semibold text-gray-800">
        Data Referance
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="flex w-72 flex-col p-2 sm:h-24 sm:w-80">
            {/* TOGGLE BUTTON */}
            <label className="flex justify-center pb-1 ">
              <span className="label-text whitespace-nowrap pr-2 font-semibold">
                New collection
              </span>
              <input
                checked={isNewCollection}
                type="checkbox"
                onClick={() => {
                  setIsNewCollection(!isNewCollection);
                }}
                className="toggle-success toggle"
              />
            </label>
            {/* INPUT VALUES */}
            <div className="flex justify-center">
              <div
                className={`w-full max-w-xs rounded-lg shadow-md ${
                  isNewCollection ? 'hidden' : 'block'
                }`}
              >
                <Select
                  firstOption={{ label: 'Pick a collection', value: '' }}
                  options={collectionKeysOptions}
                  onChange={(o: SelectOption | undefined) => {
                    onChangeKey(o);
                  }}
                  value={collectionKey}
                />
              </div>
              <input
                ref={collectionRef}
                onChange={onChange}
                type="text"
                name="collectionKey"
                placeholder="new collection key"
                className={`input-bordered input w-full max-w-xs rounded-lg shadow-md ${
                  isNewCollection ? 'block' : 'hidden'
                }`}
              />
            </div>
          </div>

          <div className="flex flex-col p-2 sm:h-fit sm:w-80">
            {/* TOGGLE BUTTON */}
            <label
              className={`flex flex-grow justify-center pb-1 ${
                (collectionKey !== undefined && collectionKey.value === '') ||
                isNewCollection
                  ? 'invisible'
                  : 'visible'
              }`}
            >
              <span className="label-text whitespace-nowrap pr-2 font-semibold">
                New document
              </span>
              <input
                type="checkbox"
                onClick={() => {
                  setIsNewDoc(!isNewDoc);
                }}
                className="toggle-success toggle"
                disabled={isNewCollection}
                checked={isNewDoc}
              />
            </label>
            {/* INPUT VALUES */}
            <div className="flex flex-grow justify-center">
              <div
                className={`w-full max-w-xs rounded-lg shadow-md ${
                  isNewCollection ||
                  isNewDoc ||
                  (collectionKey !== undefined && collectionKey.value === '')
                    ? 'hidden'
                    : 'block'
                }`}
              >
                <Select
                  firstOption={{ label: 'Pick a title(doc name)', value: '' }}
                  options={docKeysOptions}
                  onChange={(o: SelectOption | undefined) => {
                    onChangeTitle(o);
                  }}
                  value={docTitle}
                />
              </div>
              <div
                className={`${
                  collectionKey !== undefined && collectionKey.value === ''
                    ? 'hidden'
                    : 'block'
                } flex justify-center ${
                  (isNewCollection || isNewDoc) && 'w-full'
                }`}
              >
                <input
                  ref={titleRef}
                  onChange={onChange}
                  type="text"
                  name="title"
                  placeholder="new doc key"
                  className={`input-bordered input w-full max-w-xs rounded-lg shadow-md ${
                    isNewCollection || isNewDoc ? 'block' : 'hidden'
                  }`}
                />
              </div>
            </div>
            {isNewDoc && titleRef.current?.value && (
              <div className="mt-2 flex justify-center shadow-lg">
                <Select
                  firstOption={{ label: 'Pick a size type', value: '' }}
                  options={options}
                  onChange={(o: SelectOption | undefined) => {
                    onChangeSelectSizeOption(o);
                  }}
                  value={sizeOption}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SelectDbRef);
