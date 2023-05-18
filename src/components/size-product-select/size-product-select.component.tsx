/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  FC, useEffect, useRef, useState, 
} from 'react';
import { SizeStock } from '../add-firebase/add-item-stock.component';

export type SelectOption = {
  label: string
  value: string
};

type SingleSelectProps = {
  firstOption: SelectOption
  value: SelectOption
  productColor: SelectOption
  productStock: SizeStock[]
  onChange: (value: SelectOption | undefined) => void
};

type SelectProps = {
  options: SelectOption[] 
} & SingleSelectProps;

// eslint-disable-next-line object-curly-newline
export const SizeProductSelect: FC<SelectProps> = ({ firstOption, value, onChange, options, productColor, productStock }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  
  // set the selected option/s
  function selectOption(option: SelectOption) {
    if (option !== value) onChange(option);
  }
  
  function isOptionSelected(option: SelectOption) {
    return option === value;
  }
  
  // clear options in inital/refresh load
  function clearOptions() {
    onChange(firstOption);
  }

  useEffect(() => {
    clearOptions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // when open set the first marked
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
  
  const isColorOutOfStock = (colorValue: string, sizeStock: string): boolean => {
    const colorStock = productStock.some((stock) => stock.colors
      .some((color) => color.label === colorValue && color.count > 0) && stock.size === sizeStock);
    return colorStock;
  };
  
  return (
    <div ref={containerRef} tabIndex={0} onBlur={() => setIsOpen(false)} onClick={() => { setIsOpen(!isOpen); }} className="relative bg-gray-100 container flex flex-shrink items-center min-h-[2rem] p-4 shadow-sm">
      {/* value */}
      <span className="flex-grow flex gap-2 flex-wrap font-semibold text-xs tracking-widest text-slate-600 font-smoochSans bg-transparent leading-0">
        {value?.label}
      </span>
      {/* down arrow */}
      <div className="border-4 w-2 border-transparent border-t-gray-400 translate-y-1 cursor-pointer hover:border-t-gray-700"></div>
      {/* ul items */}  
      <div className={`absolute shadow-sm list-none ${isOpen ? 'block' : 'hidden'} mt-1 w-full left-0 top-full bg-gray-100`}>
        <ul defaultValue="option1">
          {options.map((option, index) => {
            return isColorOutOfStock(productColor.label, option.label)
              ? (
                <li
                  role="presentation" 
                  onClick={(e) => { e.stopPropagation(); selectOption(option); setIsOpen(false); }} 
                  onMouseEnter={() => setHighlightedIndex(index)}
                  key={option.value} 
                  className={`p-2 px-6 ${isOptionSelected(option) && 'bg-gray-300'} ${index === highlightedIndex && !isOptionSelected(option) && 'bg-gray-200'} p-1 px-2 cursor-pointer text-sm tracking-wider text-slate-600 font-smoochSans leading-0`}
                >
                  {option.label}
                </li>
              )
              : (
                <li
                  role="presentation" 
                  onMouseEnter={() => setHighlightedIndex(index)}
                  key={option.value}
                  className={`p-2 px-6 ${isOptionSelected(option) && 'bg-gray-300'} ${index === highlightedIndex && !isOptionSelected(option) && 'bg-gray-200'} p-1 px-2 cursor-not-allowed text-sm tracking-wider text-slate-600 font-smoochSans leading-0`}
                >
                  <div className="flex">
                    <span className="flex-1">
                      {option.label}
                    </span>
                    <span className="flex-none font-semibold text-xs text-red-500 mt-1">
                      Out Of Stock
                    </span>
                  </div>
                </li>
              );
          })}
        </ul>
      </div>
    </div>

  );
};

export default SizeProductSelect;
