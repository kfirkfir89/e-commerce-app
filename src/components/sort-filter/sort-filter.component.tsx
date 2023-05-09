import { useEffect, useState } from 'react';
import { SelectOption } from '../select/select.component';
import SortSelect from '../sort-select/sort-select.component';
import { SortOption } from '../../routes/category/categoryOLD.component';
import { optionsClothes, optionsColors } from '../add-firebase/add-item.component';
import SortSelectColor from '../sort-select-color/sort-select-color.component';


const optionsShoes: SelectOption[] = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'What\'s new', value: 'new' },
  { label: 'Price high to low', value: 'price-high' },
  { label: 'Price low to high', value: 'price-low' },
];

const SortFilter = ({
  onChange, onChangeColor, valueOption,
}: { onChange: (sortOption: SelectOption | SelectOption[]) => void, onChangeColor:(sortOption: SelectOption[]) => void, valueOption: SortOption }) => {
  const onChangeKey = (option: SelectOption | SelectOption[] | undefined) => {
    if (option) {
      onChange(option);
    }
  };
  const onChangeColorKey = (option: SelectOption[] | undefined) => {
    if (option) {
      onChangeColor(option);
    }
  };

  return (
    <div className="bg-transparent w-full py-3 mb-8">
      <div className="flex justify-center">
        <div className="container sm:max-w-4xl">
          <div className="grid sm:grid-cols-3 place-items-center gap-6">
            <div className="mx-2 w-full max-w-[16rem]">
              <SortSelect firstOption={{ label: 'Sort', value: '' }} options={optionsShoes} onChange={(o: SelectOption | undefined) => { onChangeKey(o); }} value={valueOption.sort} />
            </div>
            <div className="mx-2 w-full max-w-[16rem]">
              <SortSelectColor firstOption={{ label: 'Color', value: '' }} options={optionsColors} onChange={(o: SelectOption[] | undefined) => { onChangeColorKey(o); }} value={valueOption.colors} />
            </div>
            <div className="mx-2 w-full max-w-[16rem]">
              <SortSelect multiple firstOption={{ label: 'Size', value: '' }} options={optionsClothes} onChange={(o: SelectOption[] | undefined) => { onChangeKey(o); }} value={valueOption.sizes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortFilter;