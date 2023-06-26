import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { AuthError } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as GoogleIcon } from '../../assets/icons8-google.svg';

import {
  googleSignInStart,
  emailSignInStart,
} from '../../store/user/user.action';
import FormInput from '../input-form/input-form.component';
import {
  selectCurrentUser,
  selectUserError,
} from '../../store/user/user.selector';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [error, setError] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const userErrorSelector = useSelector(selectUserError);

  const { email, password } = formFields;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    dispatch(googleSignInStart());
  };

  const signInAdminDemo = async () => {
    dispatch(emailSignInStart('kfiravra89@gmail.com', 'kfiravra89!'));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(emailSignInStart(email, password));
  };

  // error handling
  useEffect(() => {
    // check for error
    if (userErrorSelector) {
      setError(
        (userErrorSelector as AuthError).code
          .replace('auth/', '')
          .replace(/-/g, ' ')
      );
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
      navigate('/');
      setShouldNavigate(false);
    }
  }, [navigate, shouldNavigate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="flex w-full max-w-md flex-col bg-gray-100 p-6 py-8 font-dosis tracking-wide text-slate-700 shadow-lg sm:p-10">
      {error && error !== 'initial' && (
        <div className="alert alert-error my-4 flex flex-col shadow-sm">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 flex-shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      <span className="mb-6 whitespace-nowrap sm:text-lg">
        Sign in with your email and password
      </span>
      <form className="flex flex-col gap-y-4 sm:px-4" onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          name="email"
          type="email"
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

        <button
          type="submit"
          className="btn mt-4 w-full rounded-none shadow-sm"
        >
          <div className="flex w-full items-center justify-center ">
            <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
              Sign In
            </span>
          </div>
        </button>
      </form>
      <div className="relative my-3 flex flex-col items-center justify-center">
        <div className="divider mx-4" />
        <span className="absolute mx-10 mb-1 w-2/6 whitespace-nowrap bg-gray-100 text-center">
          or sign in with
        </span>
      </div>
      <div className="mb-4 px-2 md:px-4">
        <button
          onClick={signInWithGoogle}
          className="btn w-full rounded-none border-dashed bg-gray-100 text-slate-700 shadow-sm hover:text-white"
        >
          <div className="flex w-full items-center justify-center gap-x-2 ">
            <GoogleIcon className="w-8" />
            <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
              Google
            </span>
          </div>
        </button>
      </div>
      <div className="mb-4 px-2 md:px-4">
        <button
          onClick={signInAdminDemo}
          className="btn w-full rounded-none border-dashed bg-gray-100 text-slate-700 shadow-sm hover:text-white"
        >
          <div className="flex w-full items-center justify-center gap-x-2 ">
            <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
              Admin demo
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SignInForm;
