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
    <div className="bg-gray-100 w-full py-3 mb-8">
      <div className="flex justify-center">
        <div className="container">
          <div className="mx-2">
            <SortSelect firstOption={{ label: 'Sort', value: '' }} options={optionsShoes} onChange={(o: SelectOption | undefined) => { onChangeKey(o); }} value={valueOption.sort} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sort;
