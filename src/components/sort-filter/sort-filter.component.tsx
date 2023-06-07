import { SelectOption } from '../select/select.component';
import SortSelect from '../sort-select/sort-select.component';
import { SortOption } from '../../routes/category/category.component';
import {
  optionsGlobal,
  optionsPants,
  optionsShoes,
  optionsShirts,
  optionsColors,
} from '../add-firebase/add-item.component';
import SortSelectColor from '../sort-select-color/sort-select-color.component';

const optionsSortBy: SelectOption[] = [
  { label: 'Recommended', value: 'recommended' },
  { label: "What's new", value: 'new' },
  { label: 'Price high to low', value: 'price-high' },
  { label: 'Price low to high', value: 'price-low' },
];
const optionsClothes: SelectOption[] = [
  ...optionsGlobal,
  ...optionsPants,
  ...optionsShoes,
  ...optionsShirts,
];

const SortFilter = ({
  onChange,
  onChangeColor,
  valueOption,
}: {
  onChange: (sortOption: SelectOption | SelectOption[]) => void;
  onChangeColor: (sortOption: SelectOption[]) => void;
  valueOption: SortOption;
}) => {
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
    <div className="mb-8 w-full bg-transparent py-3">
      <div className="flex justify-center">
        <div className="container sm:max-w-4xl">
          <div className="grid place-items-center gap-6 sm:grid-cols-3">
            <div className="mx-2 w-full max-w-[16rem]">
              <SortSelect
                firstOption={{ label: 'Sort', value: '' }}
                options={optionsSortBy}
                onChange={(o: SelectOption | undefined) => {
                  onChangeKey(o);
                }}
                value={valueOption.sort}
              />
            </div>
            <div className="mx-2 w-full max-w-[16rem]">
              <SortSelectColor
                firstOption={{ label: 'Color', value: '' }}
                options={optionsColors}
                onChange={(o: SelectOption[] | undefined) => {
                  onChangeColorKey(o);
                }}
                value={valueOption.colors}
              />
            </div>
            <div className="mx-2 w-full max-w-[16rem]">
              <SortSelect
                multiple
                firstOption={{ label: 'Size', value: '' }}
                options={optionsClothes}
                onChange={(o: SelectOption[] | undefined) => {
                  onChangeKey(o);
                }}
                value={valueOption.sizes}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortFilter;
