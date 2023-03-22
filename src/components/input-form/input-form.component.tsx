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
    <div className="flex flex-col justify-center items-center ">
      <input
        {...inputProps}
        className="flex flex-shrink items-center rounded-lg bg-white w-full min-h-[2.8em] border focus:outline focus:outline-offset-2 focus:outline-2 focus:outline-gray-400 p-2 peer"
        onChange={onChange}
        onBlur={handleFocus}
        onFocus={() => inputProps.name === 'confirmPassword' && setIsFocused(true)}
        focused={isFocused.toString()}
        placeholder={label}
      />
      <span className="text-xs self-start p-1 text-red-600 hidden peer-invalid:peer-[[focused=true]]:block">{errorMessage}</span>
    </div>
    
  );
};

export default FormInput;
