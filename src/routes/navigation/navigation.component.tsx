/* eslint-disable react/jsx-no-constructed-context-values */
import { Outlet, Link, useLocation, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { createContext, memo, useEffect, useMemo, useState } from 'react';

import { selectCurrentUser } from '../../store/user/user.selector';

import {
  UserCollectionKeys,
  getUserCollectionKeys,
} from '../../utils/firebase/firebase.utils';
import { getUserCategories } from '../../utils/firebase/firebase.category.utils';

import { ReactComponent as AdminIcon } from '../../assets/manage_accounts.svg';
import { ReactComponent as FavoriteIcon } from '../../assets/favorite_FILL0_w.svg';

import CartDropdown from '../../components/cart-dropdown/cart-dropdown.componenet';
import SideMenu from '../side-menu/side-menu.component';
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
  const [userCollectionKeys, setUserCollectionKeys] = useState<string[]>();

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
        const keys = await getUserCollectionKeys();
        setUserCollectionKeys(keys);
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

  // useLocation is used to check if the current path if the admin dashbord to hide the web navbar
  const location = useLocation();

  // side menu toggle for small screens
  const toggleIsMenuOpen = () => setIsSideMenuToggled(!isSideMenuToggled);

  // get the sub categories after hover one of the main
  const memorizedCategories = useMemo(
    () => userCategories?.get(hoverSelected),
    [hoverSelected, userCategories]
  );

  const isAdminDashboard = () => {
    if (
      location.pathname === '/admin-dashboard' ||
      location.pathname.match(/^\/admin-dashboard(\/.*)?$/)
    ) {
      return true;
    }

    return false;
  };
  return (
    <div className="flex h-full w-full flex-col">
      {/* navigation */}
      {!isAdminDashboard() && (
        <div
          className={`${
            location.pathname === '/admin-dashboard' ? 'mb-[101px]' : 'mb-0'
          }`}
        >
          <div className="navbar absolute z-[101] m-0 flex-col p-0">
            {/* main navbar */}
            <div className=" m-0 flex min-h-fit w-full justify-center bg-gray-100 p-1">
              <div className="container navbar m-0 flex min-h-fit bg-transparent p-0">
                {/* LEFT SIDE LOGO MENU */}
                <div className="flex-1 ">
                  <div className="flex-none">
                    {userCategories !== undefined && (
                      // side menu for small screens
                      <div className="z-40 flex flex-col items-center justify-center pt-2 md:hidden">
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
                  <div className="mt-2 hidden w-full px-6 md:flex">
                    <Search />
                  </div>
                </div>

                {/* RIGTH SIDE NAV BUTTONS */}
                <div className="flex">
                  <div className="z-[100] flex w-full justify-end">
                    {/* SIGNIN PROFILE ADMINDB */}
                    {currentUser && currentUser.isAdmin && (
                      <div className="flex">
                        <NavLink
                          onClick={() => setIsSideMenuToggled(false)}
                          to="/admin-dashboard"
                        >
                          <AdminIcon className="mt-[1px] w-[38px] sm:w-10" />
                        </NavLink>
                      </div>
                    )}
                    <NavLink to="favorites" className="mt-[10px] flex px-1">
                      <FavoriteIcon className="h-8 w-9" />
                    </NavLink>

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
            <div className="relative hidden w-full flex-col items-center justify-center bg-gray-700 text-white md:flex">
              <div className="container">
                <div className="flex justify-center">
                  {userCollectionKeys &&
                    userCollectionKeys.map((key) => (
                      <button
                        key={key}
                        className="relative flex flex-col  items-center justify-center"
                        onClick={() => setIsHover(!isHover)}
                      >
                        <div className="flex justify-center">
                          <div
                            className="static flex"
                            onMouseLeave={() => setIsHover(false)}
                            onMouseEnter={() => {
                              setIsHover(true);
                              setHoverSelected(key);
                            }}
                          >
                            <NavLink
                              className={({ isActive }) =>
                                isActive
                                  ? 'link-underline link-underline-black bg-gray-100 p-1 px-4 font-smoochSans text-sm uppercase leading-8 tracking-[0.075em] text-slate-700 '
                                  : 'link-underline link-underline-black p-1 px-4 font-smoochSans text-sm uppercase leading-8 tracking-[0.075em] '
                              }
                              to={key}
                              // className="link-underline link-underline-black p-1 px-4 font-smoochSans text-sm uppercase leading-8 tracking-[0.075em] "
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
                className={`grid w-full grid-rows-[0fr] overflow-hidden transition-all duration-500 ease-in-out ${
                  isHover ? 'grid-rows-[1fr]' : ''
                }`}
              >
                <div className="min-h-0">
                  <div className="flex justify-center">
                    <div className="container flex justify-center bg-gray-700">
                      <div className="flex h-full w-[448px] flex-col px-2 pb-5">
                        {memorizedCategories?.map((sc) => (
                          <div key={sc} className="flex">
                            <div className="static flex justify-start px-3">
                              <NavLink
                                to={`${hoverSelected}/${sc}`}
                                className={({ isActive }) =>
                                  isActive
                                    ? 'leading-0 z-50 p-1 font-smoochSans text-sm capitalize tracking-widest text-white underline underline-offset-4 hover:text-slate-300'
                                    : 'leading-0 z-50 p-1 font-smoochSans text-sm capitalize tracking-widest text-white hover:text-slate-300'
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
                  className={`z-10 border-b-[1px] border-dashed border-gray-100 opacity-0 transition-all duration-1000 ease-in-out ${
                    isHover ? 'opacity-100' : ''
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-2 w-full">
        <Breadcrumbs />
      </div>
      {/* message pop up */}
      <div
        className={`absolute z-[100] ${
          popUpMessage.message !== '' ? 'opacity-100' : 'hidden'
        } alert alert-success my-2 flex  flex-col opacity-0 shadow-lg transition-all duration-300 ease-in-out`}
      >
        <div
          className={`${popUpMessage.message !== '' ? 'visible' : 'invisible'}`}
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
      {/* outlet */}
      <div
        className={`scrollbarStyle scrollbarStyle-hidden relative mt-4 flex h-full w-full flex-col overflow-auto ${
          isSideMenuToggled ? 'hidden' : 'block'
        }`}
      >
        <div className="flex-grow">
          <popUpMessageContext.Provider
            value={{
              message: popUpMessage.message,
              setMessage: setPopUpMessage,
            }}
          >
            <Outlet />
          </popUpMessageContext.Provider>
        </div>

        <footer className="footer flex items-center bg-gray-700 p-4 font-smoochSans leading-7 tracking-wider text-white">
          <div className="flex-1">
            <p>© nana-style 2023 - All right reserved</p>
          </div>
          <div className="flex-none">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default memo(Navigation);
