/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  FC, useEffect, useRef, useState, 
} from 'react';

export type SelectOption = {
  label: string
  value: string
};

type MultipleSelectProps = {
  firstOption?: SelectOption
  multiple: true
  value: SelectOption[]
  onChange: (value: SelectOption[]) => void
};

type SingleSelectProps = {
  firstOption: SelectOption
  multiple?: false
  value?: SelectOption
  onChange: (value: SelectOption | undefined) => void
};

type SelectProps = {
  options: SelectOption[] 
} & (SingleSelectProps | MultipleSelectProps);

// eslint-disable-next-line object-curly-newline
export const SortSelect: FC<SelectProps> = ({ firstOption, multiple, value, onChange, options }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  
  // set the selected option/s
  function selectOption(option: SelectOption) {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
      } else {
        onChange([...value, option]);
      }
    } else if (option !== value) onChange(option);
  }
  
  function isOptionSelected(option: SelectOption) {
    return multiple ? value.includes(option) : option === value;
  }
  
  // clear options in inital/refresh load
  function clearOptions() {
    multiple ? onChange([]) : onChange(firstOption);
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
  
  return (
    <div ref={containerRef} tabIndex={0} onBlur={() => setIsOpen(false)} onClick={() => { setIsOpen(!isOpen); }} className="relative container flex flex-shrink items-center border-t-4 border-b-4 border-gray-300 border-double bg-transparent max-w-[16rem] min-h-[2rem] p-2">
      {/* value */}
      {Array.isArray(value) && value.length === 0 && <span className="font-semibold text-sm tracking-widest text-slate-600 font-smoochSans leading-0 ">{firstOption?.label}</span>}
      {value !== undefined && 'value' in value && value.label === '' && <span className="font-semibold text-gray-700">{firstOption?.label}</span>}
      <span className="flex-grow flex gap-2 flex-wrap font-semibold text-sm tracking-widest text-slate-600 font-smoochSans leading-0">
        {multiple ? value.map((v) => (
          <button key={v.value} onClick={(e) => { e.stopPropagation(); selectOption(v); }} className="flex h-6 items-center text-xs font-semibold tracking-widest text-slate-600 font-smoochSans leading-0 px-1 border-2 rounded cursor-pointer bg-none hover:outline hover:outline-gray-300 hover:outline-1 hover:outline-offset-1">
            {v.label}
            <span className="pl-1 font-thin text-lg bg-none border-none outline-none text-gray-400 hover:text-gray-700">&times;</span>
          </button>
        )) : value?.label}
      </span>
      {/* down arrow */}
      <div className="border-4 w-2 border-transparent border-t-gray-400 translate-y-1 cursor-pointer hover:border-t-gray-700"></div>
      {/* ul items */}  
      <div className={`absolute  list-none ${isOpen ? 'block' : 'hidden'} p-1 mt-1 w-full left-0 top-full bg-gray-100 border-4 border-t-0 border-gray-300 border-double z-[100]`}>
        <ul defaultValue="option1">
          {options.map((option, index) => (
            <li role="presentation" onClick={(e) => { e.stopPropagation(); selectOption(option); multiple ? setIsOpen(true) : setIsOpen(false); }} onMouseEnter={() => setHighlightedIndex(index)} key={option.value} className={`${isOptionSelected(option) && 'bg-gray-300'} ${index === highlightedIndex && !isOptionSelected(option) && 'bg-gray-200'} p-1 px-2 cursor-pointer text-sm tracking-wider text-slate-600 font-smoochSans leading-0`}>{option.label}</li>
          ))}
        </ul>
      </div>
    </div>

  );
};

export default SortSelect;
