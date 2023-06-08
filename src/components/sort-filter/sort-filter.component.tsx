import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SelectOption } from '../select/select.component';
import SortSelect from '../sort-select/sort-select.component';
import {
  CategoryRouteParams,
  SortOption,
} from '../../routes/category/category.component';
import SortSelectColor from '../sort-select-color/sort-select-color.component';
import { selectSizeSortOption } from '../../store/categories/category.selector';
import {
  optionsColors,
  optionsPants,
  optionsGlobal,
  optionsShirts,
  optionsShoes,
  SelectOptionsMapping,
} from '../add-firebase/add-item.component';
import { getCategorySortOption } from '../../utils/firebase/firebase.category.utils';

const optionsSortBy: SelectOption[] = [
  { label: 'Recommended', value: 'recommended' },
  { label: "What's new", value: 'new' },
  { label: 'Price high to low', value: 'price-high' },
  { label: 'Price low to high', value: 'price-low' },
];

const typesSizeOptions = new Map<string, SelectOption[]>([
  ['shirts', optionsShirts],
  ['pants', optionsPants],
  ['shoes', optionsShoes],
  ['global', optionsGlobal],
  ['colors', optionsColors],
]);

const SortFilter = ({
  onChange,
  onChangeColor,
  valueOption,
}: {
  onChange: (sortOption: SelectOption | SelectOption[]) => void;
  onChangeColor: (sortOption: SelectOption[]) => void;
  valueOption: SortOption;
}) => {
  // eslint-disable-next-line prettier/prettier
  const { shopPara, subCategoryPara } = useParams<keyof CategoryRouteParams>() as CategoryRouteParams;

  const sizeSortOptionSelector = useSelector(selectSizeSortOption);
  const [selectedTypeOption, setSelectedTypeOption] = useState<SelectOption[]>(
    []
  );

  useEffect(() => {
    const fetchSortOption = async () => {
      try {
        const sortOption = await getCategorySortOption(
          shopPara,
          subCategoryPara
        );
        return sortOption;
      } catch (error) {
        console.log('error:', error);
      }
    };
    const fetch = fetchSortOption().then((res) => {
      if (res) {
        console.log('res:', res);
        const options = typesSizeOptions.get(res.sizeSortOption.value);
        options && setSelectedTypeOption(options);
      }
    });
  }, [shopPara, subCategoryPara, typesSizeOptions]);

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
            {selectedTypeOption && (
              <div className="mx-2 w-full max-w-[16rem]">
                <SortSelect
                  multiple
                  firstOption={{ label: 'Size', value: '' }}
                  options={selectedTypeOption}
                  onChange={(o: SelectOption[] | undefined) => {
                    onChangeKey(o);
                  }}
                  value={valueOption.sizes}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortFilter;
