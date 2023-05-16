import { memo, useEffect, useState } from 'react';
import FormInput from '../input-form/input-form.component';
import { SelectColorOption } from '../select-color/select-color.component';
import { SelectOption } from '../select/select.component';

export type ColorStock = { label: string, value: string, count: number };

export type SizeStock = {
  size: string
  colors: ColorStock[]
};

type AddItemStockProps = {
  colors: SelectColorOption[]
  sizes: SelectOption[]
  onChange: (ItemStock: SizeStock[]) => void
};

export const AddItemStock = ({ onChange, colors, sizes }: AddItemStockProps) => {
  const [stock, setStock] = useState<SizeStock[]>([]);
  // prevent input number to except the following chars
  const exceptThisSymbols = ['e', 'E', '+', '-', '.'];

  useEffect(() => {
    onChange(stock);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stock]);
  
  // listen to sizes for changes for removing a chossen stock
  useEffect(() => {
    setStock((prevState) => {
      const newStock = prevState.filter((sizeStock) => {
        return sizes.some((size) => size.label === sizeStock.size);
      });
      return newStock;
    });
  }, [sizes]);
  
  // set initial stock value depend on size or filter depend on changes
  useEffect(() => {
    setStock((prevState) => {
      const updatedStock = prevState;
  
      sizes.forEach((s) => {
        const existingSizeStockIndex = updatedStock.findIndex((ss) => ss.size === s.label);
        if (existingSizeStockIndex !== -1) {
          updatedStock[existingSizeStockIndex] = {
            size: s.label,
            colors: colors.map((c) => {
              const existingColorStockIndex = updatedStock[existingSizeStockIndex].colors.findIndex((cs) => cs.value === c.value);
              if (existingColorStockIndex !== -1) {
                return updatedStock[existingSizeStockIndex].colors[existingColorStockIndex];
              } 
              return { label: c.label, value: c.value, count: 0 };
            }),
          };
        } else {
          updatedStock.push({
            size: s.label,
            colors: colors.map((c) => ({ label: c.label, value: c.value, count: 0 })),
          });
        }
      });
      return updatedStock;
    });
  }, [colors, sizes]);

  return (
    <div className="flex flex-wrap justify-center mb-1 gap-x-2">
      {/* render each size */}
      {stock.map((item) => {
        return (
          <div key={`${item.size}`} className="flex flex-col shadow-lg w-fit my-1">

            <div className="flex justify-center items-center bg-white text-gray-700 p-1 shadow-lg w-full rounded-t-lg font-semibold">
              Size
              {' '}
              {item.size}
              {' '}
              stock
            </div>

            <div className="flex flex-col w-72 sm:w-72">
              { item.colors
                && item.colors.map((c, i) => {
                  return (
                    <div key={`${c.label}inputstock`} className="flex">
                      <div className={`w-full max-w-xs ${c.value} p-2 ${(i + 1 === colors.length) ? 'rounded-b-lg' : ''}`}>
                        <FormInput
                          onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                          type="number"
                          name={c.label}
                          label={`stock of size ${item.size} color ${c.label}`}
                          min="0"
                          onChange={(e) => { 
                            // Find the index of the selected size in the stock state
                            const sizeIndex = stock.findIndex((s) => s.size === item.size);
                            if (stock[sizeIndex].colors === undefined) return;
                            // Find the index of the selected color in the colors array of the selected size
                            const colorIndex = stock[sizeIndex].colors?.findIndex((color) => color.label === c.label);

                            // Update the count of the selected color
                            const updatedStock = [...stock];
                            
                            updatedStock[sizeIndex].colors[colorIndex].count = e.target.valueAsNumber;

                            // Update the state with the updated stock
                            setStock(updatedStock);
                          }}
                          required
                          errorMessage="stock is empty"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div> 

        );
      })}
    </div>
  );
};

export default memo(AddItemStock);
