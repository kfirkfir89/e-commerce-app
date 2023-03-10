import {
  ChangeEvent, FormEvent, useState, 
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthError, AuthErrorCodes } from 'firebase/auth';

import { DateRangeType, DateValueType } from 'react-tailwindcss-datepicker/dist/types';
import Datepicker from 'react-tailwindcss-datepicker';
import { selectUserError } from '../../store/user/user.selector';
import FormInput from '../input-form/input-form.component';
import { signUpStart } from '../../store/user/user.action';
import { FormFields } from '../../store/user/user.types';

const defaultFormFields: FormFields = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  sendNotification: false,
};

const SignUpForm = () => {
  const dispatch = useDispatch();
  const userError = useSelector(selectUserError);
  const [values, setValues] = useState<FormFields & { confirmPassword: string, }>(defaultFormFields);
  const resetFormFields = () => {
    setValues(defaultFormFields);
  };

  console.log('render', values, userError);

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

  const handleDateValueChange = (newDatePicker: DateValueType) => {
    if (newDatePicker) {
      const date: DateRangeType = {
        startDate: newDatePicker.startDate, 
        endDate: newDatePicker.endDate,
      };
      setValues({ ...values, dateOfBirth: date });
    }
  }; 

  return (
    <div className="flex flex-col md:w-5/12 pt-28 px-5 items-center">
      {userError && <div>{ userError.message }</div>}
      <h2 className="text-4xl">Don&apos;t have an account?</h2>
      <span className="pb-6">Sign up with your email and password</span>
      <form className="grid grid-cols-1 w-full" onSubmit={handleSubmit}>
        <FormInput type="text" name="firstName" placeholder="First Name" label="First Name" pattern="^[A-Za-z0-9]{3,16}$" onChange={onChange} required errorMessage="First name should be 3-16 characters and shouldn't include any special character!" />
        <FormInput type="text" name="lastName" placeholder="Last Name" label="Last Name" pattern="^[A-Za-z0-9]{3,16}$" onChange={onChange} required errorMessage="Last name should be 3-16 characters and shouldn't include any special character!" />
        <FormInput type="email" name="email" placeholder="Email" label="Email" onChange={onChange} required errorMessage="It should be a valid email address!" />
        <Datepicker useRange={false} asSingle value={values.dateOfBirth} onChange={handleDateValueChange} /> 
        <FormInput type="password" name="password" placeholder="Password" label="Password" pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$" onChange={onChange} required errorMessage="Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!" />
        <FormInput type="password" name="confirmPassword" placeholder="Confirm Password" label="Confirm Password" pattern={values.password} onChange={onChange} required errorMessage="Passwords don't match!" />
        <label className="cursor-pointer label">
          <span className="label-text">SEND ME NOTIFICATION</span>
          <input type="checkbox" className="checkbox checkbox-success text-slate-300" name="sendNotification" onChange={handleCheckBox} />
        </label>

        {
          (userError !== null && 'code' in userError) && <div>userError.code</div>
        }
        
        <button type="submit" className="btn btn-secondary">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;

