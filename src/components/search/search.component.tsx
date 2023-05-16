import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as SearchIcon } from '../../assets/manage_search.svg';
import { ItemPreview } from '../add-firebase/add-item.component';
import { getItemsSearch } from '../../utils/firebase/firebase.utils';
import { featchSearchPreview } from '../../store/categories/category.action';
import { selectCategoriesSearchPreview } from '../../store/categories/category.selector';


const Search = () => {
  const [searchItems, setSearchItems] = useState<ItemPreview[]>([]);
  const [inputField, setInputField] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [option, selectOption] = useState<string>('');

  const searchPreviewSelector = useSelector(selectCategoriesSearchPreview);
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  
  // fetch all the items for search
  useEffect(() => {
    const fetchItemsSearch = async () => {
      try {
        if (searchPreviewSelector.length <= 0) {
          const items = await getItemsSearch();
          dispatch(featchSearchPreview(items));
        }
      } catch (error) {
        console.log('error:', error);
      }
    };
    const fetch = fetchItemsSearch();
  }, [dispatch, searchPreviewSelector.length]);

  // filter items depend on inputField
  const performSearch = (inputField: string, searchPreviewSelector: ItemPreview[]) => {
    const searchTerm = inputField.toLowerCase();
  
    return searchPreviewSelector.filter((item) => {
      const productName = item.productName.toLowerCase();
      const collectionKey = item.collectionKey.toLowerCase();
      const docKey = item.docKey.toLowerCase();
  
      // Check for partial word matching using regular expressions
      const regex = new RegExp(searchTerm.replace(/[-\s]/g, '[-\\s]'), 'i');
    
      // Perform search on multiple properties
      return (
        regex.test(productName)
        || regex.test(collectionKey)
        || regex.test(docKey)
      );
    });
  };

  // filter the results
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setHighlightedIndex(-1);
      if (inputField.trim() === '') {
        setSearchItems([]);
      } else {
        const results = performSearch(inputField, searchPreviewSelector);
        setSearchItems(results);
      }
    }, 0);

    // clear the debounce timer if the input changes before it fires
    return () => clearTimeout(debounceTimer);
  }, [searchPreviewSelector, inputField]);
  

  // keyboard effect
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) return;

      // eslint-disable-next-line default-case
      switch (e.code) {
        case 'Enter':
        case 'Space':
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(searchItems[highlightedIndex].id);
          break;
        case 'ArrowUp':
        case 'ArrowDown': {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }
  
          const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);
          if (newValue >= 0 && newValue < searchItems.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener('keydown', handler);

    // remove listener when unmount
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      containerRef.current?.removeEventListener('keydown', handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, highlightedIndex, searchItems]);


  
  // scroll to the current option
  useEffect(() => {
    if (ulRef.current) {
      const scrollItem = ulRef.current.children[highlightedIndex] as HTMLElement;
      scrollItem && setTimeout(() => {
        scrollItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [highlightedIndex]);

  useEffect(() => { }, [option]);

  function isOptionSelected() {
    return option === searchItems[highlightedIndex].productName;
  }
  const onClickButtonHandler = () => {
    navigate('/search-results', { state: searchItems });
  };

  return (
    <div className="relative flex flex-col justify-center items-center w-full">
      <div className="flex items-center w-full pb-1 z-50">
        <div className="flex px-3 absolute">
          <SearchIcon className="w-7 h-7 text-slate-700 opacity-60" />
        </div>
        <input type="text" onChange={(e) => { setInputField(e.target.value); }} className="input h-10 rounded-full pl-12 pr-16 w-full" /> 
        <div className="flex absolute right-2 shadow-sm rounded-r-full">
          <button onClick={onClickButtonHandler} className="rounded-full active:bg-black bg-gray-100 h-7 flex justify-center items-center w-full focus:border-[1px] focus:border-slate-400 outline-none opacity-70 focus:opacity-100 shadow-sm hover:bg-gray-200">
            <span className="uppercase flex font-smoochSans font-semibold text-[9px] leading-5 px-2 text-slate-400">
              search
            </span>
          </button>
        </div>
      </div>
      
      <div ref={containerRef} tabIndex={0} className={`absolute overflow-y-auto outline-none focus:border-x focus:border-slate-400 z-40 top-6 bg-gray-100 ${searchItems.length > 0 ? 'pt-4' : ''} max-h-72 w-full grid grid-rows-[0fr] transition-all duration-500 ease-in-out  ${searchItems.length > 0 ? 'grid-rows-[1fr]  shadow-md' : ''}`}>
        <div className="min-h-0 overflow-y-auto scrollbarStyle">
          <ul ref={ulRef} tabIndex={0} className="flex flex-col bg-gray-100 outline-none">
            {
            inputField.length > 0
            && searchItems.map((item, index) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
              <li key={item.id} onClick={(e) => { e.stopPropagation(); selectOption(option); setIsOpen(false); }} onMouseEnter={() => setHighlightedIndex(index)} className={`${index === highlightedIndex && !isOptionSelected() && 'bg-gray-200'} focus-within:bg-gray-200 p-1 px-2 cursor-pointer`}>
                <Link className="flex border-none outline-none" to={`${item.collectionKey}/${item.docKey}/${item.slug}`} state={item.id}>
                  {item.productName}
                </Link>
              </li>
            ))
          }
          </ul>
        </div>
        <div className={`border-dashed border-slate-700 border-b-[1px] transition-all duration-1000 ease-in-out opacity-0 ${searchItems.length > 0 ? 'opacity-100' : ''}`}></div>
      </div>
    </div>










  );
};

export default Search;
