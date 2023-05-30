/* eslint-disable react/jsx-no-constructed-context-values */
import { Outlet, Link, useLocation, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { createContext, memo, useEffect, useMemo, useState } from 'react';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.componenet';

import { selectCurrentUser } from '../../store/user/user.selector';

import { ReactComponent as AdminIcon } from '../../assets/manage_accounts.svg';

import SideMenu from '../side-menu/side-menu.component';
import {
  UserCollectionKeys,
  getUserCategories,
  getUserCollectionKeys,
} from '../../utils/firebase/firebase.utils';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs.component';
import Search from '../../components/search/search.component';
import ProfileDropdown from '../../components/profile-dropdown/profile-dropdown.componenet';

export type ShopCategoryRouteParams = {
  shopPara: string;
};

// pop up message context use to change the message in the nav state
export const popUpMessageContext = createContext({
  message: '',
  setMessage: (value: { message: string }) => {},
});

const Navigation = () => {
  const currentUser = useSelector(selectCurrentUser);

  const [popUpMessage, setPopUpMessage] = useState({ message: '' });
  const [isHover, setIsHover] = useState(false);
  const [isSideMenuToggled, setIsSideMenuToggled] = useState(false);
  const [hoverSelected, setHoverSelected] = useState('');
  const [userCategories, setUserCategories] = useState<Map<string, string[]>>();
  const [userCollectionKeys, setUserCollectionKeys] =
    useState<UserCollectionKeys>();

  // popup message timer
  useEffect(() => {
    if (popUpMessage.message !== '') {
      setTimeout(() => setPopUpMessage({ message: '' }), 2000);
    }
  }, [popUpMessage]);

  useEffect(() => {
    if (isHover) {
      setIsHover(true);
    } else {
      const timeout = setTimeout(() => {
        setIsHover(false);
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [isHover]);

  // featch only the userKeys(collectionKeys) from the system-data obj
  useEffect(() => {
    const featchUserCollectionKeys = async () => {
      try {
        const keys: UserCollectionKeys[] = await getUserCollectionKeys();
        setUserCollectionKeys(keys[0]);
      } catch (error) {
        console.log(error);
      }
    };
    const featch = featchUserCollectionKeys();
  }, []);

  // featch all the user categories keys by userCollectionKeys
  useEffect(() => {
    const featchUserCollectionKeys = async () => {
      try {
        const keys: Map<string, string[]> = await getUserCategories();
        setUserCategories(keys);
      } catch (error) {
        console.log(error);
      }
    };
    const featch = featchUserCollectionKeys();
  }, []);

  // side menu toggle for small screens
  const toggleIsMenuOpen = () => setIsSideMenuToggled(!isSideMenuToggled);

  // useLocation is used to check if the current path if the admin dashbord to hide the web navbar
  const path = useLocation();

  // get the sub categories after hover one of the main
  const memorizedCategories = useMemo(
    () => userCategories?.get(hoverSelected),
    [hoverSelected, userCategories]
  );

  return (
    <>
      {!(
        path.pathname === '/admin-dashboard' ||
        path.pathname.match(/^\/admin-dashboard(\/.*)?$/)
      ) && (
        <div className="absolute z-[100] flex w-screen justify-center">
          <div className="navbar m-0 flex-col p-0">
            {/* main navbar */}
            <div className=" m-0 flex min-h-fit w-full justify-center bg-gray-100 p-2">
              <div className="container navbar m-0 flex min-h-fit bg-transparent p-0">
                {/* LEFT SIDE LOGO MENU */}
                <div className="flex-1 ">
                  <div className="flex-none">
                    {userCategories !== undefined && (
                      // side menu for small screens
                      <div className="z-40 flex flex-col items-center justify-center pt-2 lg:hidden ">
                        <SideMenu
                          onChangeToggle={toggleIsMenuOpen}
                          categories={userCategories}
                        />
                      </div>
                    )}
                  </div>
                  <div className="z-50 sm:flex-none">
                    <Link to="/">
                      <div className="mt-2 flex">
                        <span className="whitespace-nowrap font-smoochSans text-lg font-bold uppercase tracking-tighter text-slate-700 sm:text-xl">
                          nana style
                        </span>
                        {/* <img className="w-8/12 pl-2 opacity-90 sm:w-full" src="/src/assets/NANA STYLE.png" alt="gfd" /> */}
                      </div>
                    </Link>
                  </div>
                  <div className="mt-2 hidden w-full px-6 lg:flex">
                    <Search />
                  </div>
                </div>

                {/* RIGTH SIDE NAV BUTTONS */}
                <div className="flex">
                  <div className="z-[100] flex w-full justify-end">
                    {/* SIGNIN PROFILE ADMINDB */}
                    {currentUser && currentUser.isAdmin && (
                      <div className="flex">
                        <Link to="/admin-dashboard">
                          <AdminIcon className="mt-[1px] w-[38px] sm:w-10" />
                        </Link>
                      </div>
                    )}

                    <ProfileDropdown />
                    {/* CART */}
                    <div className="mt-1 pl-1">
                      <CartDropdown />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* categories navbar */}
            <div className="relative hidden w-full flex-col items-center justify-center bg-white lg:flex">
              <div className="container pt-2">
                <div className="flex justify-center">
                  {userCollectionKeys &&
                    userCollectionKeys.keys.map((key) => (
                      <button
                        key={key}
                        className="relative flex flex-col items-center justify-center"
                        onClick={() => setIsHover(!isHover)}
                      >
                        <div className="flex justify-center">
                          <div
                            className="static flex px-3"
                            onMouseLeave={() => setIsHover(false)}
                            onMouseEnter={() => {
                              setIsHover(true);
                              setHoverSelected(key);
                            }}
                          >
                            <NavLink
                              to={key}
                              className="leading-0 link-underline link-underline-black p-1 font-smoochSans text-sm uppercase tracking-[0.075em] text-slate-700"
                            >
                              {key}
                            </NavLink>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              <div
                tabIndex={0}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                className={`grid w-full grid-rows-[0fr] overflow-hidden transition-all duration-500 ease-in-out  ${
                  isHover ? 'grid-rows-[1fr]' : ''
                }`}
              >
                <div className="min-h-0">
                  <div className="flex justify-center">
                    <div className="container flex justify-center bg-white">
                      <div className="mb-8 mt-2 flex w-[448px] flex-col px-2">
                        {memorizedCategories?.map((sc) => (
                          <div key={sc} className="flex">
                            <div className="static flex justify-start px-3">
                              <NavLink
                                to={`${hoverSelected}/${sc}`}
                                className={({ isActive }) =>
                                  isActive
                                    ? 'leading-0 z-50 p-1 font-smoochSans text-sm capitalize tracking-widest text-slate-900 underline underline-offset-4 hover:text-slate-900'
                                    : 'leading-0 z-50 p-1 font-smoochSans text-sm capitalize tracking-widest text-slate-500 hover:text-slate-900'
                                }
                              >
                                {sc}
                              </NavLink>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`border-b-[1px] border-dashed border-slate-700 opacity-0 transition-all duration-1000 ease-in-out ${
                    isHover ? 'opacity-100' : ''
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={`absolute flex h-full w-full flex-col pt-20 lg:pt-28 ${
          isSideMenuToggled ? 'hidden' : 'block'
        }`}
      >
        <Breadcrumbs />
        {/* message pop up */}
        <div
          className={`absolute z-[100] ${
            popUpMessage.message !== '' ? 'opacity-100' : 'hidden'
          } alert alert-success my-2 flex  flex-col opacity-0 shadow-lg transition-all duration-300 ease-in-out`}
        >
          <div
            className={`${
              popUpMessage.message !== '' ? 'visible' : 'invisible'
            }`}
          >
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
            <span>{popUpMessage.message}</span>
          </div>
        </div>

        <popUpMessageContext.Provider
          value={{ message: popUpMessage.message, setMessage: setPopUpMessage }}
        >
          <Outlet />
        </popUpMessageContext.Provider>
      </div>
    </>
  );
};

export default memo(Navigation);
