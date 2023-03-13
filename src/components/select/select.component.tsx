/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  FC, useEffect, useRef, useState, 
} from 'react';

export type SelectOption = {
  label: string
  value: string | number
};

type MultipleSelectProps = {
  multiple: true
  value: SelectOption[]
  onChange: (value: SelectOption[]) => void
};

type SingleSelectProps = {
  multiple?: false
  value?: SelectOption
  onChange: (value: SelectOption | undefined) => void
};

type SelectProps = {
  options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps);

// eslint-disable-next-line object-curly-newline
export const Select: FC<SelectProps> = ({ multiple, value, onChange, options }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  function clearOptions() {
    multiple ? onChange([{ label: 'Select an option', value: 'select' }]) : onChange({ label: 'Select an option', value: 'select' });
  }
  
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
    <div ref={containerRef} tabIndex={0} onBlur={() => setIsOpen(false)} onClick={() => { setIsOpen(!isOpen); }} className="relative container flex flex-shrink items-center rounded-lg bg-white max-w-[20rem] min-h-[2.8em] border focus:outline focus:outline-offset-2 focus:outline-2 focus:outline-gray-400 p-2">
      {/* value */}
      <span className="flex-grow flex gap-2 flex-wrap">
        {}
        {multiple ? value.map((v) => (
          <button key={v.value} onClick={(e) => { e.stopPropagation(); selectOption(v); }} className="flex items-center px-2 border-2 rounded cursor-pointer bg-none hover:outline hover:outline-gray-300 hover:outline-1 hover:outline-offset-1">
            {v.label}
            <span className="pl-1 text-lg bg-none border-none outline-none text-gray-400 hover:text-gray-700">&times;</span>
          </button>
        )) : value?.label}
      </span>
      {/* close btn */}
      {/* <button onClick={(e) => { e.stopPropagation(); clearOptions(); }} type="button" className="bg-none border-none outline-none text-gray-400 text-lg focus:text-black hover:text-black">&times;</button> */}
      {/* diviver */}
      <div className="bg-gray-400 self-stretch w-[.05em] mx-2 opacity-70"></div>
      {/* down arrow */}
      <div className="border-4 w-2 border-transparent border-t-gray-400 translate-y-1 cursor-pointer"></div>
      {/* ul items */}  
      <div className={`absolute  list-none ${isOpen ? 'block' : 'hidden'} p-1 mt-1 rounded w-full left-0 top-full bg-white border border-gray-400 focus:border-white z-[100]`}>
        <ul>
          {options.map((option, index) => (
            <li role="presentation" onClick={(e) => { e.stopPropagation(); selectOption(option); setIsOpen(true); }} onMouseEnter={() => setHighlightedIndex(index)} key={option.value} className={`${isOptionSelected(option) && 'bg-gray-300'} ${index === highlightedIndex && !isOptionSelected(option) && 'bg-gray-200'} p-1 px-2 cursor-pointer`}>{option.label}</li>
          ))}
        </ul>
      </div>
    </div>

  );
};

export default Select;
