/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { FC, useEffect, useRef, useState } from 'react';

import { ReactComponent as NoColorIcon } from '../../assets/block_FILL0.svg';
import { SelectOption } from '../select/select.component';

export type SelectColorOption = {
  label: string;
  value: string;
};

type SelectProps = {
  value: SelectColorOption[];
  firstOption: SelectOption;
  onChange: (value: SelectColorOption[]) => void;
};

type SelectColorProps = {
  options: SelectColorOption[];
} & SelectProps;

// eslint-disable-next-line object-curly-newline
export const SelectColor: FC<SelectColorProps> = ({
  firstOption,
  value,
  onChange,
  options,
}: SelectColorProps) => {
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
      <span className="flex flex-grow flex-wrap gap-2">
        {value.map((v) =>
          v.label === 'nocolor' ? (
            <button
              key={v.label}
              onClick={(e) => {
                e.stopPropagation();
                selectOption(v);
              }}
              className={`flex items-center justify-center ${v.value} h-9 w-9 cursor-pointer rounded-lg shadow-lg hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-gray-300`}
            >
              <span className="border-none bg-none text-lg text-gray-400 outline-none hover:text-gray-700">
                <NoColorIcon />
              </span>
            </button>
          ) : (
            <button
              key={v.label}
              onClick={(e) => {
                e.stopPropagation();
                selectOption(v);
              }}
              className={`flex items-center justify-center ${v.value} h-9 w-9 cursor-pointer rounded-lg shadow-lg hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-gray-300`}
            >
              <span className="border-none bg-none text-lg text-gray-400 outline-none hover:text-gray-700">
                &times;
              </span>
            </button>
          )
        )}
      </span>
      {/* close btn */}
      {/* <button onClick={(e) => { e.stopPropagation(); clearOptions(); }} type="button" className="bg-none border-none outline-none text-gray-400 text-lg focus:text-black hover:text-black">&times;</button> */}
      {/* diviver */}
      <div className="mx-2 w-[.05em] self-stretch bg-gray-400 opacity-70"></div>
      {/* down arrow */}
      <div className="w-2 translate-y-1 cursor-pointer border-4 border-transparent border-t-gray-400 hover:border-t-gray-700"></div>
      {/* ul items */}
      <div
        className={`absolute list-none ${
          isOpen ? 'block' : 'hidden'
        } left-0 top-full z-[100] mt-1 w-full rounded border border-gray-400 bg-white p-1 focus:border-white`}
      >
        <div className="flex flex-wrap gap-x-4 gap-y-3">
          {options.map((option, index) =>
            option.label === 'nocolor' ? (
              <div
                role="presentation"
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(option);
                  setIsOpen(true);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                key={option.label}
                className={`${isOptionSelected(option) && ''} ${
                  index === highlightedIndex && !isOptionSelected(option) && ''
                } flex items-center justify-center px-2 ${option.value} bg-[${
                  option.value
                }] h-9 w-9 cursor-pointer rounded-lg p-1 px-2 shadow-lg hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-gray-300`}
              >
                <div className="opacity-40">
                  <NoColorIcon />
                </div>
              </div>
            ) : (
              <div
                role="presentation"
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(option);
                  setIsOpen(true);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                key={option.label}
                className={`${isOptionSelected(option) && ''} ${
                  index === highlightedIndex && !isOptionSelected(option) && ''
                } flex items-center justify-center px-2 ${option.value} bg-[${
                  option.value
                }] h-9 w-9 cursor-pointer rounded-lg p-1 px-2 shadow-lg hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-gray-300`}
              ></div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectColor;
