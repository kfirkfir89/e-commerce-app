/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as ProfileIcon } from '../../assets/person_FILL0.svg';
import { ReactComponent as LogoutIcon } from '../../assets/logout_FILL0.svg';
import { ReactComponent as LoginIcon } from '../../assets/login_FILL0.svg';

import { signOutStart } from '../../store/user/user.action';
import {
  selectCurrentUser,
  selectUserIsLoading,
} from '../../store/user/user.selector';

const ProfileDropdown = () => {
  const currentUserSelector = useSelector(selectCurrentUser);
  const userIsLoadingSelector = useSelector(selectUserIsLoading);
  const dispatch = useDispatch();

  const [isIconHover, setIsIconHover] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const signOutUser = () => dispatch(signOutStart());

  const navigate = useNavigate();

  useEffect(() => {
    if (isHover) {
      setIsIconHover(true);
    } else {
      const timeout = setTimeout(() => {
        setIsIconHover(false);
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [isHover]);

  const onClickIconHandler = () => {
    setIsIconHover(false);
    if (currentUserSelector && !userIsLoadingSelector) {
      return navigate('/my-account');
    }
    return navigate('/authentication');
  };

  return (
    <div className="relative z-[100]">
      <button
        className="relative flex flex-col items-center justify-center"
        onClick={onClickIconHandler}
        onMouseEnter={() => setIsIconHover(true)}
        onMouseLeave={() => setIsIconHover(false)}
      >
        <ProfileIcon className="mt-1 w-10 sm:w-[42px]" />
        <div
          className={`absolute bottom-0 w-4 border-8 border-dashed border-transparent border-b-slate-300 opacity-0 transition-all duration-200 ease-in-out ${
            isIconHover ? 'opacity-100' : ''
          }`}
        ></div>
      </button>

      <div
        className={`absolute right-1 grid w-48 grid-rows-[0fr] overflow-hidden transition-all duration-500 ease-in-out ${
          isIconHover
            ? 'grid-rows-[1fr] border border-b-0 border-slate-300 shadow-md'
            : ''
        }`}
      >
        <div
          className="min-h-0"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {currentUserSelector && (
            <div className="leading-0 flex max-w-3xl flex-col bg-slate-300 p-2 font-dosis text-xs font-normal uppercase tracking-wide text-slate-700">
              <h2>
                Welcome,{' '}
                <span className="pl-1 text-base font-semibold capitalize">
                  {currentUserSelector.displayName}
                </span>
              </h2>
            </div>
          )}
          <div className="bg-gray-100">
            <ul className="flex flex-col text-sm">
              {currentUserSelector === null ? (
                <li className="hover:bg-gray-200">
                  <Link
                    to="/authentication"
                    className="flex items-center p-1 px-2 text-center font-smoochSans tracking-wider text-slate-700"
                  >
                    <LoginIcon className=" mr-1 w-9" />
                    Sign In
                  </Link>
                </li>
              ) : (
                <>
                  <li className="hover:bg-gray-200">
                    <Link
                      to="/my-account"
                      className="flex items-center p-1 px-2 text-center font-smoochSans tracking-wider text-slate-700"
                    >
                      <ProfileIcon className=" mr-1 w-9" />
                      My Account
                    </Link>
                  </li>
                  <li className="hover:bg-gray-200">
                    <Link
                      onClick={signOutUser}
                      to="/"
                      className="flex items-center p-1 px-3 text-center font-smoochSans tracking-wider text-slate-700"
                    >
                      <LogoutIcon className=" mr-1 w-8" />
                      Sign Out
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="border-b-[1px] border-dashed border-slate-700"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
