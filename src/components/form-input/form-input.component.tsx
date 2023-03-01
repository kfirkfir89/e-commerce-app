import { InputHTMLAttributes, FC } from 'react';

type FormInputProps = { label: string } & InputHTMLAttributes<HTMLInputElement>;

const FormInput: FC<FormInputProps> = ({ label, ...otherProps }) => {
  return (
    <div className="relative">
      {label && (
        <input type="text" placeholder={label} className="input w-full max-w-xs my-3" {...otherProps} />
      )}
    </div>
  );
};

export default FormInput;

