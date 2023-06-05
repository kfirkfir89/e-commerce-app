/* eslint-disable react/no-unknown-property */
/* eslint-disable react/require-default-props */
import { useState, FC, ChangeEvent, InputHTMLAttributes } from 'react';

export type Inputs = {
  errorMessage?: string;
  label: string;
  focused?: string;
};

export type InputProps = InputHTMLAttributes<HTMLInputElement> & Inputs;

const FormInput: FC<InputProps> = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    label,
    errorMessage,
    onChange,
    id,
    className,
    focused,
    ...inputProps
  } = props;

  const handleFocus = (e: ChangeEvent<HTMLInputElement>) => {
    setIsFocused(true);
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <input
        {...inputProps}
        className="peer flex min-h-[2.8em] w-full flex-shrink items-center  bg-white p-2 shadow-sm outline-none focus:border-[1px] focus:border-dashed focus:border-slate-400"
        onChange={onChange}
        onBlur={handleFocus}
        onFocus={() =>
          inputProps.name === 'confirmPassword' && setIsFocused(true)
        }
        focused={isFocused.toString()}
        placeholder={label}
      />
      <span className="hidden self-start p-1 px-2 text-sm text-red-600 peer-invalid:peer-[[focused=true]]:block">
        {errorMessage}
      </span>
    </div>
  );
};

export default FormInput;
