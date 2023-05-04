/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  FC, useEffect, useRef, useState, 
} from 'react';

import { ReactComponent as NoColorIcon } from '../../assets/block_FILL0.svg';
import { SelectOption } from '../select/select.component';

export type SelectColorOption = {
  label: string
  value: string
};

type SelectProps = {
  value: SelectColorOption[]
  firstOption: SelectOption
  onChange: (value: SelectColorOption[]) => void
};

type SelectColorProps = {
  options: SelectColorOption[]
} & SelectProps;

// eslint-disable-next-line object-curly-newline
export const SortSelectColor: FC<SelectColorProps> = ({ firstOption, value, onChange, options }: SelectColorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  function clearOptions() {
    onChange([]);
  }
  
  function selectOption(option: SelectColorOption) {
    if (value.includes(option)) {
      onChange(value.filter((o) => o !== option));
    } else {
      onChange([...value, option]);
    }
  }

  function isOptionSelected(option: SelectColorOption) {
    return value.includes(option);
  }
  
  useEffect(() => {
    clearOptions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  // keyboard navigation effect
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) return;
      // eslint-disable-next-line default-case
      switch (e.code) {
        case 'Enter':
        case 'Space':
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case 'ArrowUp':
        case 'ArrowDown': {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }
  
          const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
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
  }, [isOpen, highlightedIndex, options]);
  
  return (
    <div ref={containerRef} tabIndex={0} onBlur={() => setIsOpen(false)} onClick={() => { setIsOpen(!isOpen); }} className="relative container flex flex-shrink items-center border-t-4 border-b-4 border-gray-300 border-double bg-transparent max-w-[16rem] min-h-[2rem] p-2">
      {/* value */}
      {Array.isArray(value) && value.length === 0 && <span className="font-semibold text-gray-700">{firstOption?.label}</span>}
      <span className="flex-grow flex gap-2 flex-wrap">
        
        {value.map((v) => (
          v.label === 'nocolor' 
            ? (
              <button key={v.value} onClick={(e) => { e.stopPropagation(); selectOption(v); }} className={`flex justify-center items-center ${v.value} shadow-lg h-6 w-6 rounded-lg cursor-pointer hover:outline hover:outline-gray-300 hover:outline-1 hover:outline-offset-1`}>
                <span className="text-lg bg-none border-none outline-none text-gray-400 hover:text-gray-700">
                  <NoColorIcon />
                </span>
              </button>
            ) 
            : (
              <button key={v.value} onClick={(e) => { e.stopPropagation(); selectOption(v); }} className={`flex justify-center items-center ${v.value} shadow-lg h-6 w-6 rounded-lg cursor-pointer hover:outline hover:outline-gray-300 hover:outline-1 hover:outline-offset-1`}>
                <span className="text-lg bg-none border-none outline-none text-gray-300 hover:text-gray-700">&times;</span>
              </button>
            )
        ))}
      </span>
      {/* close btn */}
      {/* <button onClick={(e) => { e.stopPropagation(); clearOptions(); }} type="button" className="bg-none border-none outline-none text-gray-400 text-lg focus:text-black hover:text-black">&times;</button> */}
      {/* down arrow */}
      <div className="border-4 w-2 border-transparent border-t-gray-400 translate-y-1 cursor-pointer hover:border-t-gray-700"></div>
      {/* ul items */}  
      <div className={`absolute list-none ${isOpen ? 'block' : 'hidden'} p-1 mt-1 rounded w-full left-0 top-full bg-white border border-gray-400 focus:border-white z-[100]`}>
        <div className="flex flex-wrap gap-x-4 gap-y-3">
          {options.map((option, index) => (
            option.label === 'nocolor' 
              ? (
                <div
                  role="presentation"
                  onClick={(e) => { e.stopPropagation(); selectOption(option); setIsOpen(true); }} 
                  onMouseEnter={() => setHighlightedIndex(index)} 
                  key={option.value} 
                  className={`${isOptionSelected(option) && ''} ${index === highlightedIndex && !isOptionSelected(option) && ''} px-2 flex justify-center items-center ${option.value} bg-[${option.value}] p-1 px-2 cursor-pointer shadow-lg h-9 w-9 rounded-lg hover:outline hover:outline-gray-300 hover:outline-1 hover:outline-offset-1`}
                >
                  <div className="opacity-40">
                    <NoColorIcon />
                  </div>
                </div>
              ) 
              : (
                <div
                  role="presentation"
                  onClick={(e) => { e.stopPropagation(); selectOption(option); setIsOpen(true); }} 
                  onMouseEnter={() => setHighlightedIndex(index)} 
                  key={option.value} 
                  className={`${isOptionSelected(option) && ''} ${index === highlightedIndex && !isOptionSelected(option) && ''} px-2 flex justify-center items-center ${option.value} bg-[${option.value}] p-1 px-2 cursor-pointer shadow-lg h-9 w-9 rounded-lg hover:outline hover:outline-gray-300 hover:outline-1 hover:outline-offset-1`}
                >
                </div>
              )
          ))}
        </div>
      </div>
    </div>

  );
};

export default SortSelectColor;
