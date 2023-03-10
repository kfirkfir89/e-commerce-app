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
    multiple ? onChange([]) : onChange(undefined);
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
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
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
          if (newValue < options.length - 1 ? newValue + 1 : newValue) {
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

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      containerRef.current?.removeEventListener('keydown', handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, highlightedIndex, options]);

  return (
    <div ref={containerRef} onBlur={() => setIsOpen(false)} tabIndex={0} onClick={() => setIsOpen(!isOpen)} className="container flex items-center rounded bg-slate-100 w-full min-h-[2.5em] border border-slate-600 focus:border-white relative p-2">
      {/* value */}
      <span className="flex-grow flex gap-2 flex-wrap">
        {multiple ? value.map((v) => (
          <button key={v.value} onClick={(e) => { e.stopPropagation(); selectOption(v); }} className="flex items-center px-2 border-2 rounded cursor-pointer bg-none outline-none hover:bg-rose-400">
            {v.label}
            <span className="pl-1 text-lg bg-none border-none outline-none text-slate-600 focus:text-black hover:text-black">&times;</span>
          </button>
        )) : value?.label}
      </span>
      {/* close btn */}
      <button onClick={(e) => { e.stopPropagation(); clearOptions(); }} type="button" className="bg-none border-none outline-none text-slate-600 text-lg focus:text-black hover:text-black">&times;</button>
      {/* diviver */}
      <div className="bg-slate-600 self-stretch w-[.05em] mx-1"></div>
      {/* down arrow */}
      <div className="border-4 w-2 border-transparent border-slate-600 border-t-slate-600 translate-y-1"></div>
      {/* ul items */}
      <ul className={`absolute ${isOpen ? 'block' : 'hidden'} p-1 mt-1 rounded list-none overflow-y-auto max-h-20 w-full left-0 top-full bg-slate-100 border border-slate-600 focus:border-white z-[100]`}>
        {options.map((option, index) => (
          <li role="presentation" onClick={(e) => { e.stopPropagation(); selectOption(option); setIsOpen(false); }} onMouseEnter={() => setHighlightedIndex(index)} key={option.value} className={`${isOptionSelected(option) && 'bg-slate-300'} ${index === highlightedIndex && !isOptionSelected(option) && 'bg-slate-200'} p-1 px-2 cursor-pointer`}>{option.label}</li>
        ))}
      </ul>
    </div>
  );
};

export default Select;
