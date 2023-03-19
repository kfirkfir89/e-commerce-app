import {
  useState, FC, ChangeEvent, InputHTMLAttributes, 
} from 'react';

export type Inputs = {
  errorMessage?: string;
  label: string;
  focused?: string;
};

export type InputProps = InputHTMLAttributes<HTMLInputElement> & Inputs;

const FormInput: FC<InputProps> = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    label, errorMessage, onChange, id, className, focused, ...inputProps
  } = props;

  const handleFocus = (e: ChangeEvent<HTMLInputElement>) => {
    setIsFocused(true);
  };

  return (
    <div className="flex flex-col w-full">
      <input
        {...inputProps}
        className="input my-2 outline focus:outline-secondary outline-slate-300 outline-offset-2 outline-2 border-[0px] border-r-8 border-slate-200 peer"
        onChange={onChange}
        onBlur={handleFocus}
        onFocus={() => inputProps.name === 'confirmPassword' && setIsFocused(true)}
        focused={isFocused.toString()}
        placeholder={label}
      />
      <span className="text-xs text-red-600 hidden peer-invalid:peer-[[focused=true]]:block">{errorMessage}</span>
    </div>
  );
};

export default FormInput;
