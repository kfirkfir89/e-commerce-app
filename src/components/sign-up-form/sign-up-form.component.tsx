import { useState, FormEvent, ChangeEvent } from 'react';
import { AuthError, AuthErrorCodes } from 'firebase/auth';
import { useDispatch } from 'react-redux';

import FormInput from '../form-input/form-input.component';

import { signUpStart } from '../../store/user/user.action';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {
    displayName, email, password, confirmPassword, 
  } = formFields; 
  const dispatch = useDispatch();
  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('password do not match!');
      return;
    }
    
    try {
      dispatch(signUpStart(email, password, displayName));
      resetFormFields();
    } catch (error) {
      if ((error as AuthError).code === AuthErrorCodes.EMAIL_EXISTS) {
        alert('Cannot Create user, email already in use');
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="flex flex-col w-[380px] px-5">
      <h2 className="mt-2 text-4xl">Don`&apos;`t have an account?</h2>
      <span className="pl-1">Sign up with your email and password</span>
      <form className="grid grid-col-4 mt-2" onSubmit={(e) => handleSubmit}>
        
        <FormInput 
          label="Display Name"
          name="displayName" 
          type="text" 
          onChange={handleChange} 
          value={displayName} 
          required
        />

        <FormInput 
          label="Email"
          name="email" 
          type="text" 
          onChange={handleChange} 
          value={email} 
          required
        />

        <FormInput 
          label="Password"
          name="password" 
          type="password" 
          onChange={handleChange} 
          value={password} 
          required
        />

        <FormInput 
          label="Comfirm Password"
          name="confirmPassword" 
          type="password" 
          onChange={handleChange} 
          value={confirmPassword} 
          required
        />

        <div className="grid grid-cols-4">
          <div className="flex flex-col col-start-2 col-span-2 gap-3">
            <button type="submit" className="btn btn-secondary">Sign Up</button>
          </div>
        </div>

      </form>
      
    </div>
    
  );
};

export default SignUpForm;
