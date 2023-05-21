import {
  useState, FormEvent, ChangeEvent, useEffect, useRef, 
} from 'react';
import { AuthError, AuthErrorCodes } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as GoogleIcon } from '../../assets/icons8-google.svg';


import { googleSignInStart, emailSignInStart } from '../../store/user/user.action';
import FormInput from '../input-form/input-form.component';
import { selectUserError } from '../../store/user/user.selector';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignInForm = () => {
  const dispatch = useDispatch();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [error, setError] = useState('initial');
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const { email, password } = formFields; 

  const userErrorSelector = useSelector(selectUserError);

  const navigate = useNavigate();

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signInWithGoogle = async () => {
    dispatch(googleSignInStart());
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(emailSignInStart(email, password));
  };
  
  // error handling 
  useEffect(() => {
    const isError = () => {
      if (userErrorSelector) {
        setError((userErrorSelector as AuthError).code.replace('auth/', '').replace(/-/g, ' '));
      }

      if (userErrorSelector === null) {
        setError('');
      }
      
      if (error === '') {
        resetFormFields();
        return true; // will trigger navigation
      }
      return false; // will not trigger navigation
    };
    
    setShouldNavigate(isError());
  }, [userErrorSelector]);
  
  useEffect(() => {
    if (shouldNavigate) {
      setError('initial');
      navigate('/');
      setShouldNavigate(false);
    }
  }, [error]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="flex flex-col w-full max-w-md shadow-lg p-6 sm:p-10 py-8 bg-gray-100 font-dosis tracking-wide text-slate-700">
      {error && error !== 'initial'
      && (
      <div className="alert alert-error shadow-sm flex flex-col my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>{error}</span>
        </div>
      </div>
      )}
      <span className="mb-6 sm:text-lg whitespace-nowrap">Sign in with your email and password</span>
      <form className="flex flex-col gap-y-4 sm:px-4" onSubmit={handleSubmit}>

        <FormInput 
          label="Email"
          name="email" 
          type="text" 
          onChange={handleChange} 
          value={email} 
          errorMessage="It should be a valid email address!"
          required
        />

        <FormInput 
          label="Password"
          name="password" 
          type="password" 
          onChange={handleChange} 
          value={password} 
          errorMessage="Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!"
          required
        />
        
        <button type="submit" className="btn rounded-none w-full shadow-sm mt-4">
          <div className="w-full flex justify-center items-center ">
            <span className="flex pt-1 font-semibold text-xs tracking-widest font-smoochSans uppercase leading-0">
              Sign In
            </span>
          </div>
        </button>

      </form>
      <div className="relative flex flex-col justify-center items-center my-3">
        <div className="divider mx-4" />
        <span className="absolute text-center mb-1 mx-10 w-2/6 bg-gray-100 whitespace-nowrap">or sign in with</span>
      </div>
      <div className="px-4 mb-4">
        <button onClick={signInWithGoogle} className="btn rounded-none w-full shadow-sm bg-gray-100 text-slate-700 hover:text-white border-dashed">
          <div className="w-full flex gap-x-2 justify-center items-center ">
            <GoogleIcon className="w-8" />
            <span className="flex pt-1 font-semibold text-xs tracking-widest font-smoochSans uppercase leading-0">
              Google
            </span>
          </div>
        </button>
      </div>
      
    </div>
    
  );
};

export default SignInForm;
