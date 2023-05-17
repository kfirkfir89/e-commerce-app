import {
  ChangeEvent, FormEvent, useState, 
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthError, AuthErrorCodes } from 'firebase/auth';

import { Timestamp } from 'firebase/firestore';
import { selectUserError } from '../../store/user/user.selector';
import FormInput from '../input-form/input-form.component';
import { signUpStart } from '../../store/user/user.action';


export type FormFields = {
  firstName: string,
  lastName: string,
  dateOfBirth: Timestamp,
  displayName?: string,
  email: string,
  password: string,
  confirmPassword: string,
  sendNotification: boolean,
};

const defaultFormFields: FormFields = {
  firstName: '',
  lastName: '',
  dateOfBirth: Timestamp.fromDate(new Date()),
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  sendNotification: false,
};

const SignUpForm = () => {
  const dispatch = useDispatch();
  const userError = useSelector(selectUserError);
  const [values, setValues] = useState<FormFields>(defaultFormFields);
  
  const resetFormFields = () => {
    setValues(defaultFormFields);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      dispatch(signUpStart(values));
      resetFormFields();
    } catch (error) {
      if ((error as AuthError).code === AuthErrorCodes.EMAIL_EXISTS) {
        alert('Cannot Create user, email already in use');
      }
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setValues({ ...values, [e.target.name]: !values.sendNotification });
    }
  }; 

  const handleDateValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value; // Get the date from the input field
  
    // Convert the date to a Timestamp
    const timestamp = Timestamp.fromDate(new Date(date));
  
    setValues({ ...values, dateOfBirth: timestamp });
  };
  return (
    <div className="flex flex-col w-full max-w-md shadow-lg m-4 p-10 py-8 bg-gray-100 font-dosis tracking-wide text-slate-700">
      {userError && <div>{ userError.message }</div>}
      <span className="mb-6 text-lg">Sign up with your email and password</span>
      <form className="flex flex-col gap-y-4 px-4" onSubmit={handleSubmit}>
        <FormInput type="text" name="firstName" placeholder="First Name" label="First Name" pattern="^[A-Za-z0-9]{3,16}$" onChange={onChange} required errorMessage="First name should be 3-16 characters and shouldn't include any special character!" />
        <FormInput type="text" name="lastName" placeholder="Last Name" label="Last Name" pattern="^[A-Za-z0-9]{3,16}$" onChange={onChange} required errorMessage="Last name should be 3-16 characters and shouldn't include any special character!" />
        <FormInput type="email" name="email" placeholder="Email" label="Email" onChange={onChange} required errorMessage="It should be a valid email address!" />
        <input required type="date" onChange={handleDateValueChange} className="flex flex-shrink items-center text-gray-400 bg-white w-full min-h-[2.8em]  outline-none focus:border-dashed focus:border-[1px] focus:border-slate-400 p-2"></input>
        <FormInput type="password" name="password" placeholder="Password" label="Password" pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$" onChange={onChange} required errorMessage="Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!" />
        <FormInput type="password" name="confirmPassword" placeholder="Confirm Password" label="Confirm Password" pattern={values.password} onChange={onChange} required errorMessage="Passwords don't match!" />
        <label className="cursor-pointer label">
          <span className="label-text">SEND ME NOTIFICATION</span>
          <input type="checkbox" className="checkbox checkbox-success text-slate-300" name="sendNotification" onChange={handleCheckBox} />
        </label>

        {
          (userError !== null && 'code' in userError) && <div>userError.code</div>
        }
        
        <button type="submit" className="btn rounded-none w-full shadow-sm mt-4">
          <div className="w-full flex justify-center items-center ">
            <span className="flex pt-1 font-semibold text-xs tracking-widest font-smoochSans uppercase leading-0">
              Sign Up
            </span>
          </div>
        </button>
      </form>
    </div>

  );
};

export default SignUpForm;

