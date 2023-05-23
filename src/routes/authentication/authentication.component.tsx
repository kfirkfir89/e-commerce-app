import { useState } from 'react';
import SignInForm from '../../components/sign-in-form/sign-in-form.component';
import SignUpForm from '../../components/sign-up-form/sign-up-form.component';

const Authentication = () => {
  const [isNewUser, setIsNewUser] = useState(false);

  return (
    <div className="flex flex-col sm:mt-40 justify-center items-center text-slate-700 px-2">

      {
        isNewUser ? (
          <div className="flex flex-col w-full justify-center items-center">
            <SignUpForm />
            <div>
              <span>Already have an account?&ensp;</span>
              <button onClick={() => setIsNewUser(false)} className="font-semibold hover:text-blue-400">
                <span>
                  Sign in
                </span>
              </button>    
            </div>    
          </div>
        ) : (
          <div className="flex flex-col w-full justify-center items-center">
            <SignInForm />
            <div className="mt-4">
              <span>Don&apos;t have an account?&ensp;</span>
              <button onClick={() => setIsNewUser(true)} className="font-semibold hover:text-blue-400">
                <span>
                  Sign up
                </span>
              </button>    
            </div>    
          </div>
        )
      }
    </div>
  );
};

export default Authentication;
