import {
  ChangeEvent, FormEvent, useContext, useEffect, useState, 
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthError } from 'firebase/auth';

import { Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectUserError } from '../../store/user/user.selector';
import FormInput from '../input-form/input-form.component';
import { signUpStart } from '../../store/user/user.action';
import { popUpMessageContext } from '../../routes/navigation/navigation.component';


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
  const [formFields, setFormFields] = useState<FormFields>(defaultFormFields);
  const [error, setError] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const userErrorSelector = useSelector(selectUserError);
  
  const { setMessage } = useContext(popUpMessageContext);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // error handling 
  useEffect(() => {
    // check for error
    if (userErrorSelector) {
      setError((userErrorSelector as AuthError).code.replace('auth/', '').replace(/-/g, ' '));
    }
    // navigate after user signin
    if (userErrorSelector === null && currentUser) {
      setShouldNavigate(true);
    }
    // navigate when use fixed the erros
    if (userErrorSelector === null && error !== '') {
      setShouldNavigate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userErrorSelector, currentUser]);

  // navigate to to home page
  useEffect(() => {
    if (shouldNavigate) {
      setMessage({ message: 'Please check your email to verify your account.' });
      navigate('/');
      setShouldNavigate(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, shouldNavigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(signUpStart(formFields));
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setFormFields({ ...formFields, [e.target.name]: !formFields.sendNotification });
    }
  }; 

  const handleDateValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value; // Get the date from the input field
  
    // Convert the date to a Timestamp
    const timestamp = Timestamp.fromDate(new Date(date));
  
    setFormFields({ ...formFields, dateOfBirth: timestamp });
  };

  return (
    <div className="flex flex-col w-full max-w-md shadow-lg m-4 p-6 sm:p-10 py-8 bg-gray-100 font-dosis tracking-wide text-slate-700">
      {error && error !== 'initial'
      && (
      <div className="alert alert-error shadow-sm flex flex-col my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>{error}</span>
        </div>
      </div>
      )}
      <span className="mb-6 sm:text-lg whitespace-nowrap">Sign up with your email and password</span>
      <form className="flex flex-col gap-y-4 sm:px-4" onSubmit={handleSubmit}>
        <FormInput type="text" name="firstName" placeholder="First Name" label="First Name" pattern="^[A-Za-z0-9]{3,16}$" onChange={onChange} required errorMessage="First name should be 3-16 characters and shouldn't include any special character!" />
        <FormInput type="text" name="lastName" placeholder="Last Name" label="Last Name" pattern="^[A-Za-z0-9]{3,16}$" onChange={onChange} required errorMessage="Last name should be 3-16 characters and shouldn't include any special character!" />
        <FormInput type="email" name="email" placeholder="Email" label="Email" onChange={onChange} required errorMessage="It should be a valid email address!" />
        <input required type="date" onChange={handleDateValueChange} className="flex flex-shrink items-center text-gray-400 bg-white w-full min-h-[2.8em]  outline-none focus:border-dashed focus:border-[1px] focus:border-slate-400 p-2"></input>
        <FormInput type="password" name="password" placeholder="Password" label="Password" pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$" onChange={onChange} required errorMessage="Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!" />
        <FormInput type="password" name="confirmPassword" placeholder="Confirm Password" label="Confirm Password" pattern={formFields.password} onChange={onChange} required errorMessage="Passwords don't match!" />
        <label className="cursor-pointer label">
          <span className="label-text">SEND ME NOTIFICATION</span>
          <input type="checkbox" className="checkbox checkbox-success text-slate-300" name="sendNotification" onChange={handleCheckBox} />
        </label>
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

