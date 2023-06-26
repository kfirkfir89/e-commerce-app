import { FormEvent, useRef, useState } from 'react';

import { sendPasswordResetEmailFireBase } from '../../utils/firebase/firebase.user.utils';

import SignInForm from '../../components/sign-in-form/sign-in-form.component';
import SignUpForm from '../../components/sign-up-form/sign-up-form.component';
import FormInput from '../../components/input-form/input-form.component';

const Authentication = () => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState('');

  const modalRef = useRef<HTMLInputElement>(null);

  const forgetPasswordHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = sendPasswordResetEmailFireBase(forgetPasswordEmail);
    if (modalRef.current) {
      modalRef.current.checked = false;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-2 text-slate-700 sm:mt-40 ">
      {isNewUser ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-white">
          <SignUpForm />
          <div>
            <span>Already have an account?&ensp;</span>
            <button
              onClick={() => setIsNewUser(false)}
              className="font-semibold hover:text-blue-400"
            >
              <span>Sign in</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-white">
          <SignInForm />
          <div className="mt-4">
            <span>Don&apos;t have an account?&ensp;</span>
            <button
              onClick={() => setIsNewUser(true)}
              className="font-semibold hover:text-blue-400"
            >
              <span>Sign up</span>
            </button>
          </div>

          {/* forget password modal */}
          <div className="mb-8 mt-2 bg-white">
            <label
              htmlFor="my-modal-4"
              className="cursor-pointer font-semibold hover:text-blue-400"
            >
              <span>Forget password</span>
            </label>

            <input
              ref={modalRef}
              type="checkbox"
              id="my-modal-4"
              className="modal-toggle"
            />
            <label htmlFor="my-modal-4" className="modal cursor-pointer">
              <label className="modal-box relative bg-white" htmlFor="">
                <h3 className="text-lg font-bold tracking-wider">
                  Forgot password?
                </h3>
                <p className="p-4">
                  Please enter the email address you used to create your
                  account, and we&#39;ll send you a link to reset your password.
                </p>
                <form onSubmit={forgetPasswordHandler}>
                  <div className="shadow-md">
                    <FormInput
                      label="Email"
                      name="email"
                      type="email"
                      onChange={(e) => setForgetPasswordEmail(e.target.value)}
                      value={forgetPasswordEmail}
                      errorMessage="It should be a valid email address!"
                      required
                    />
                  </div>

                  <div className="modal-action">
                    <button className="btn w-full rounded-none border-dashed bg-gray-100 text-slate-700 shadow-sm hover:text-white">
                      <div className="flex w-full items-center justify-center gap-x-2 ">
                        <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                          Submit
                        </span>
                      </div>
                    </button>
                  </div>
                </form>
              </label>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authentication;
