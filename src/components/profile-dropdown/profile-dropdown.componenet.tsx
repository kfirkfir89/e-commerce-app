/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ReactComponent as ProfileIcon } from '../../assets/person_FILL0.svg';

import { signOutStart } from '../../store/user/user.action';
import { selectCurrentUser } from '../../store/user/user.selector';


const ProfileDropdown = () => {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const [isIconHover, setIsIconHover] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const signOutUser = () => dispatch(signOutStart());
  
  useEffect(() => {
    if (isHover) {
      setIsIconHover(true);
    } else {
      const timeout = setTimeout(() => {
        setIsIconHover(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isHover]);

  return (
    <div className="z-[100] relative">

      <button className="relative flex flex-col justify-center items-center" onClick={() => setIsIconHover(!isIconHover)} onMouseEnter={() => setIsIconHover(true)} onMouseLeave={() => setIsIconHover(false)}>
        <ProfileIcon className="w-10 sm:w-[42px] mt-1" />
        <div className={`absolute bottom-0 border-8 w-4 border-transparent border-dashed border-b-slate-300 transition-all duration-200 ease-in-out opacity-0 ${isIconHover ? 'opacity-100' : ''}`}></div>
      </button>

      <div className={`absolute right-1 w-48 grid grid-rows-[0fr] overflow-hidden transition-all duration-500 ease-in-out ${isIconHover ? 'grid-rows-[1fr] border border-slate-300 border-b-0 shadow-md' : ''}`}>
        <div className="min-h-0" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
          {
            currentUser
          && (
          <div className="flex flex-col p-2 max-w-3xl bg-slate-300 tracking-wide font-dosis text-xs font-normal uppercase leading-0 text-slate-700">
            <h2>
              Welcome,
              {' '}
              <span className="font-semibold text-base capitalize pl-1">
                {currentUser.displayName}
              </span>
            </h2>
          </div>
          )
          }
          <div className="bg-gray-100">
            <ul className="flex flex-col">
              {
                currentUser === null ? (
                  <li className="hover:bg-gray-300"><Link to="/authentication" className="flex p-2 tracking-wider font-smoochSans text-slate-700">Sign In</Link></li>
                )
                  : (
                    <>
                      <li className="hover:bg-gray-300"><Link to="/profile" className="flex p-2 tracking-wider font-smoochSans text-slate-700">Profile</Link></li>
                      <li className="hover:bg-gray-300"><Link to="/" className="flex p-2 tracking-wider font-smoochSans text-slate-700">Settings</Link></li>
                      <li className="hover:bg-gray-300"><Link onClick={signOutUser} to="/" className="flex p-2 tracking-wider font-smoochSans text-slate-700">Logout</Link></li>
                    </>
                  )
              }
            </ul>
          </div>
          <div className="border-dashed border-slate-700 border-b-[1px]"></div>
        </div>
      </div>


    </div>
  

  );
};

export default ProfileDropdown;
