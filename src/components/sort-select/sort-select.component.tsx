/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { FC, useEffect, useRef, useState } from 'react';

export type SelectOption = {
  label: string;
  value: string;
};

type MultipleSelectProps = {
  firstOption?: SelectOption;
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  firstOption: SelectOption;
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

// eslint-disable-next-line object-curly-newline
export const SortSelect: FC<SelectProps> = ({
  firstOption,
  multiple,
  value,
  onChange,
  options,
}: SelectProps) => {
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
    <div
      ref={containerRef}
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
      onClick={() => {
        setIsOpen(!isOpen);
      }}
      className="container relative flex min-h-[2rem] max-w-[16rem] flex-shrink items-center border-b-4 border-t-4 border-double border-gray-300 bg-transparent p-2"
    >
      {/* value */}
      {Array.isArray(value) && value.length === 0 && (
        <span className="leading-0 font-smoochSans text-sm font-semibold tracking-widest text-slate-600 ">
          {firstOption?.label}
        </span>
      )}
      {value !== undefined && 'value' in value && value.label === '' && (
        <span className="font-semibold text-gray-700">
          {firstOption?.label}
        </span>
      )}
      <span className="leading-0 flex flex-grow flex-wrap gap-2 font-smoochSans text-sm font-semibold tracking-widest text-slate-600">
        {multiple
          ? value.map((v) => (
              <button
                key={v.label}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
                className="leading-0 flex h-6 cursor-pointer items-center rounded border-2 bg-none px-1 font-smoochSans text-xs font-semibold tracking-widest text-slate-600 hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-gray-300"
              >
                {v.label}
                <span className="border-none bg-none pl-1 text-lg font-thin text-gray-400 outline-none hover:text-gray-700">
                  &times;
                </span>
              </button>
            ))
          : value?.label}
      </span>
      {/* down arrow */}
      <div className="w-2 translate-y-1 cursor-pointer border-4 border-transparent border-t-gray-400 hover:border-t-gray-700"></div>
      {/* ul items */}
      <div
        className={`absolute  list-none ${
          isOpen ? 'block' : 'hidden'
        } scrollbarStyle left-0 top-full z-[100] mt-1 h-96 w-full overflow-auto border-4 border-t-0 border-double border-gray-300 bg-gray-100 p-1`}
      >
        <ul defaultValue="option1">
          {options.map((option, index) => (
            <li
              role="presentation"
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
                multiple ? setIsOpen(true) : setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              key={option.label}
              className={`${isOptionSelected(option) && 'bg-gray-300'} ${
                index === highlightedIndex &&
                !isOptionSelected(option) &&
                'bg-gray-200'
              } leading-0 cursor-pointer p-1 px-2 font-smoochSans text-sm tracking-wider text-slate-600`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SortSelect;
