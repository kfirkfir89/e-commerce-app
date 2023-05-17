import { useState, FormEvent, ChangeEvent } from 'react';
import { AuthError, AuthErrorCodes } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { ReactComponent as GoogleIcon } from '../../assets/icons8-google.svg';


import { googleSignInStart, emailSignInStart } from '../../store/user/user.action';
import FormInput from '../input-form/input-form.component';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignInForm = () => {
  const dispatch = useDispatch();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields; 
  const navigate = useNavigate();

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signInWithGoogle = async () => {
    dispatch(googleSignInStart());
    navigate('/');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      dispatch(emailSignInStart(email, password));
      navigate('/');
      resetFormFields();
    } catch (error) {
      switch ((error as AuthError).code) {
        case AuthErrorCodes.INVALID_PASSWORD:
          alert('incorrect password for email');
          break;
        case AuthErrorCodes.USER_DELETED:
          alert('no user associated with this email');
          break;
        default:
          console.log(error);
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="flex flex-col w-full max-w-md shadow-lg m-4 p-10 py-8 bg-gray-100 font-dosis tracking-wide text-slate-700">
      <span className="mb-6 text-lg">Sign in with your email and password</span>
      <form className="flex flex-col gap-y-4 px-4" onSubmit={handleSubmit}>

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
          pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$" 
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
        <span className="absolute text-center mb-1 mx-10 w-2/6 bg-gray-100">or sign in with</span>
      </div>
      <div className="px-2 mb-4">
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
