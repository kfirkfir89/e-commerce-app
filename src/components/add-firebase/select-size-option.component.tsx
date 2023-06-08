import { FC } from 'react';
import Select, { SelectOption } from '../select/select.component';

type SelectSizeOptionProps = {
  sizeOption: SelectOption | undefined;
  onChangeSelectSizeOption: (option: SelectOption | undefined) => void;
};

const SelectSizeOption: FC<SelectSizeOptionProps> = (
  props: SelectSizeOptionProps
) => {
  const { onChangeSelectSizeOption, sizeOption } = props;
  const options: SelectOption[] = [
    { label: 'shirts', value: 'shirts' },
    { label: 'pants', value: 'pants' },
    { label: 'shoes', value: 'shoes' },
    { label: 'global', value: 'global' },
  ];
  return (
    <div className="flex justify-center">
      <Select
        firstOption={{ label: 'Pick a size type', value: '' }}
        options={options}
        onChange={(o: SelectOption | undefined) => {
          onChangeSelectSizeOption(o);
        }}
        value={sizeOption}
      />
    </div>
  );
};

export default SelectSizeOption;
