/* eslint-disable react/jsx-no-constructed-context-values */
import {
  Outlet, Link, useLocation, NavLink,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  createContext,
  memo, useEffect, useMemo, useState, 
} from 'react';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.componenet';

import { selectCurrentUser } from '../../store/user/user.selector';

import { ReactComponent as AdminIcon } from '../../assets/manage_accounts.svg';

import SideMenu from '../side-menu/side-menu.component';
import {
  UserCollectionKeys,
  getUserCategories, getUserCollectionKeys,
} from '../../utils/firebase/firebase.utils';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';
import Search from '../../components/search/search.component';
import ProfileDropdown from '../../components/profile-dropdown/profile-dropdown.componenet';

export type ShopCategoryRouteParams = {
  shopPara: string
};

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
  const [userCollectionKeys, setUserCollectionKeys] = useState<UserCollectionKeys>();

  // popup message timer
  useEffect(() => {
    if (popUpMessage.message !== '') {
      setTimeout(() => setPopUpMessage({ message: '' }), 3000);
    }
  }, [popUpMessage]);

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
  
  // featch all the user categories by userCollectionKeys
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
  
  const memorizedCategories = useMemo(() => userCategories?.get(hoverSelected), [hoverSelected, userCategories]);
  return (
    <>
      {!(path.pathname === '/admin-dashboard' || path.pathname.match(/^\/admin-dashboard(\/.*)?$/)) && (
        <div className="flex justify-center w-screen z-[100] absolute">
          <div className="flex-col p-0 m-0 navbar">
            {/* main navbar */}
            
            <div className=" flex w-full justify-center min-h-fit bg-gray-100 m-0 p-2">
              <div className="flex navbar min-h-fit container bg-transparent m-0 p-0">
                {/* LEFT SIDE LOGO MENU */}
                <div className="flex-1 ">
                  <div className="flex-none">
                    {
                      userCategories !== undefined
                    && (
                      // side menu for small screens
                    <div className="z-40 flex flex-col items-center justify-center pt-2 lg:hidden ">
                      <SideMenu onChangeToggle={toggleIsMenuOpen} categories={userCategories} /> 
                    </div>
                    )
                    }
                  </div>
                  <div className="sm:flex-none z-50">
                    <Link to="/">
                      <div className="flex mt-2">
                        <span className="tracking-tighter whitespace-nowrap font-smoochSans sm:text-xl text-lg font-bold uppercase text-slate-700">nana style</span>
                        {/* <img className="w-8/12 pl-2 opacity-90 sm:w-full" src="/src/assets/NANA STYLE.png" alt="gfd" /> */}
                      </div>
                    </Link>
                  </div>
                  <div className="w-full mt-2 px-6 lg:flex hidden">
                    <Search />
                  </div>
                </div>

                {/* RIGTH SIDE NAV BUTTONS */}
                <div className="flex">
                  <div className="z-[100] flex justify-end w-full">
                    {/* SIGNIN PROFILE ADMINDB */}
                    {
                      currentUser && currentUser.isAdmin
                    && (
                    <div className="flex">
                      <Link to="/admin-dashboard">
                        <AdminIcon className="w-[38px] sm:w-10 mt-[1px]" />
                      </Link>
                    </div>
                    )
                    }

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

            <div className="relative flex-col w-full justify-center items-center hidden bg-white lg:flex">

              <div className="container p-2">
                <div className="flex justify-center">
                  {userCollectionKeys && userCollectionKeys.keys.map((key) => (
                    <button key={key} className="relative flex flex-col justify-center items-center" onClick={() => setIsHover(!isHover)} onMouseEnter={() => setIsHover(true)}>
                      <div className="flex justify-center">
                        <div className="static flex px-3" onMouseEnter={() => { setIsHover(true); setHoverSelected(key); }}>
                          <NavLink to={key} className="p-1 uppercase text-sm tracking-[0.075em] font-smoochSans leading-0 text-slate-700 link-underline link-underline-black">
                            {key}
                          </NavLink>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div tabIndex={0} onMouseLeave={() => setIsHover(false)} className={`w-full grid grid-rows-[0fr] overflow-hidden transition-all duration-500 ease-in-out ${isHover ? 'grid-rows-[1fr]' : ''}`}>
                <div className="min-h-0">
                  <div className="flex justify-center">
                    <div className="container flex justify-center bg-white">
                      <div className="flex flex-col w-[448px] mb-4 px-2">
                        {memorizedCategories?.map((sc) => (
                          <div key={sc} className="flex">
                            <div className="static flex px-3 justify-start">
                              <NavLink
                                to={`${hoverSelected}/${sc}`}
                                className={({ isActive }) => (isActive ? 'p-1 capitalize text-sm z-50 tracking-widest text-slate-900 font-smoochSans leading-0 hover:text-slate-900 underline underline-offset-4' : 'p-1 capitalize text-sm z-50 tracking-widest text-slate-500 font-smoochSans leading-0 hover:text-slate-900')}
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
                <div className={`border-dashed border-slate-700 border-b-[1px] transition-all duration-1000 ease-in-out opacity-0 ${isHover ? 'opacity-100' : ''}`}></div>
              </div>

            </div>
                

          </div>
        </div>
      )}
      <div className={`pt-20 ${isSideMenuToggled ? 'hidden' : 'block'}`}>
        <Breadcrumbs />

        <div className={`absolute z-[100] ${popUpMessage.message !== '' ? 'opacity-100' : ''} transition-all duration-300 ease-in-out opacity-0  alert alert-success shadow-lg flex flex-col my-2`}>
          <div className={`${popUpMessage.message !== '' ? 'visible' : 'invisible'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{popUpMessage.message}</span>
          </div>
        </div>

        <popUpMessageContext.Provider value={{ message: popUpMessage.message, setMessage: setPopUpMessage }}>
          <Outlet />
        </popUpMessageContext.Provider>
      </div>
    </>
  );
};

export default memo(Navigation);
