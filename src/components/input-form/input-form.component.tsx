import {
  useState, FC, InputHTMLAttributes, ChangeEvent, 
} from 'react';
import { Inputs } from '../sign-up-form/sign-up-form.component';

type InputProps = {
  label:string,
} & Inputs & InputHTMLAttributes<HTMLInputElement>;

const FormInput: FC<InputProps> = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    label, errorMessage, onChange, id, focused, className, ...inputProps
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
