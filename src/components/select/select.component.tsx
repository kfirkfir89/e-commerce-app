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
export const Select: FC<SelectProps> = ({
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
      className="container relative flex min-h-[2.8em] max-w-[20rem] flex-shrink items-center rounded-lg border bg-white p-2 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-gray-400"
    >
      {/* value */}
      {Array.isArray(value) && value.length === 0 && (
        <span className="font-semibold text-gray-700">
          {firstOption?.label}
        </span>
      )}
      {value &&
        !Array.isArray(value) &&
        value !== undefined &&
        value.value === '' && (
          <span className="font-semibold text-gray-700">
            {firstOption?.label}
          </span>
        )}
      <span className="flex flex-grow flex-wrap gap-2 font-semibold text-gray-700">
        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
                className="flex cursor-pointer items-center rounded border-2 bg-none px-2 hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-gray-300"
              >
                {v.label}
                <span className="border-none bg-none pl-1 text-lg text-gray-400 outline-none hover:text-gray-700">
                  &times;
                </span>
              </button>
            ))
          : value?.label}
      </span>
      {/* close btn */}
      {/* <button onClick={(e) => { e.stopPropagation(); clearOptions(); }} type="button" className="bg-none border-none outline-none text-gray-400 text-lg focus:text-black hover:text-black">&times;</button> */}
      {/* diviver */}
      <div className="mx-2 w-[.05em] self-stretch bg-gray-400 opacity-70"></div>
      {/* down arrow */}
      <div className="w-2 translate-y-1 cursor-pointer border-4 border-transparent border-t-gray-400 hover:border-t-gray-700"></div>
      {/* ul items */}
      <div
        className={`absolute  list-none ${
          isOpen ? 'block' : 'hidden'
        } left-0 top-full z-[100] mt-1 w-full rounded border border-gray-400 bg-white p-1 focus:border-white`}
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
              key={option.value}
              className={`${isOptionSelected(option) && 'bg-gray-300'} ${
                index === highlightedIndex &&
                !isOptionSelected(option) &&
                'bg-gray-200'
              } cursor-pointer p-1 px-2`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Select;
