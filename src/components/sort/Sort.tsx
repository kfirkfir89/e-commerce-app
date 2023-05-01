import { SelectOption } from '../select/select.component';
import SortSelect from '../sort-select/sort-select.component';
import { SortOption } from '../../routes/category/category.component';

const optionsShoes: SelectOption[] = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'What\'s new', value: 'new' },
  { label: 'Price high to low', value: 'price-high' },
  { label: 'Price low to high', value: 'price-low' },
];
const Sort = ({ onChange, valueOption }: { onChange: (sortOption: SelectOption) => void, valueOption: SortOption }) => {
  const onChangeKey = (option: SelectOption | undefined) => {
    if (option) {
      onChange(option);
    }
  };

  return (
    <div className="bg-gray-300 w-full">
      <div className="w-full max-w-xs shadow-md rounded-lg">
        <SortSelect firstOption={{ label: 'Sort', value: '' }} options={optionsShoes} onChange={(o: SelectOption | undefined) => { onChangeKey(o); }} value={valueOption.sort} />
      </div>
    </div>
  );
};

export default Sort;
