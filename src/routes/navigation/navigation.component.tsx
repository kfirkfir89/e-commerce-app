import {
  Outlet, Link, Routes, Route, matchPath, useLocation,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { useState } from 'react';
import CartIcon from '../../components/cart-icon/cart-icon.component';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.componenet';

import { selectIsMenuOpen } from '../../store/menu/menu.selector';
import { selectCurrentUser } from '../../store/user/user.selector';

import { ReactComponent as FaceMan } from '../../assets/face_FILL0.svg';
import { signOutStart } from '../../store/user/user.action';

import MenuIcon from '../menu/menu.component';
import NavigationLinks from '../navigation-links/navigation-links.component';


const Navigation = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  // useLocation is used to check if the current path if the admin dashbord to hide the web navbar
  const path = useLocation();

  const signOutUser = () => dispatch(signOutStart());

  return (
    <>
      {!(path.pathname === '/admin-dashboard' || path.pathname.match(/^\/admin-dashboard(\/.*)?$/)) && (
        <div className="flex justify-center md:px-5 md:py-2">
          <div className="navbar container flex-col m-0 bg-base-100 p-0">
            {/* main navbar */}
            <div className="navbar min-h-fit p-0 m-0 flex items-start">
              <div className="flex-1 ">
                <div className="flex-none sm:flex-none">
                  <div className="flex flex-col w-full items-center justify-center pl-2 pt-2 z-40 sm:hidden">
                    <MenuIcon /> 
                  </div>
                </div>
                <div className="flex-none z-50 pl-2">
                  <Link to="/">
                    <div className="font-custom whitespace-nowrap text-xl sm:text-3xl text-slate-700 hover:text-secondary hover:animate-waving-hand">nana-style</div>
                  </Link>
                </div>
              </div>
              <div className="flex-none pt-1">
                <div className="flex w-full justify-end z-40">
                  <div className="pt-2">
                    <Link to="/admin-dashboard">DB</Link>
                  </div>
                  {
                    currentUser === null
                      ? (
                        <div className="flex-1 px-2">
                          <ul className="menu menu-horizontal px-1">
                            <li><Link to="/auth">Sign In</Link></li>
                          </ul>
                        </div>
                      )
                      : (
                        <div className="dropdown dropdown-end px-2 ">
                          <label tabIndex={0}>
                            <div className="sm:w-8 w-7 relative flex items-center justify-center cursor-pointer">
                              <FaceMan className="hover:text-secondary hover:animate-spin" />
                            </div>
                          </label>
                          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                              <Link to="/profile" className="justify-between">
                                Profile
                                <span className="badge">New</span>
                              </Link>
                            </li>
                            <li><Link to="/">Settings</Link></li>
                            <li><Link to="/" onClick={signOutUser}>Logout</Link></li>
                          </ul>
                        </div>
                      )
                    }
                  <div className="flex-none z-50 pr-4">
                    <div className="dropdown dropdown-end w-full">
                      <CartIcon />
                      <div tabIndex={0} className="dropdown-content p-2 drop-shadow-2xl bg-base-100 rounded-box w-80 sm:w-96">
                        <CartDropdown />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* categories navbar */}
            <div className="navbar p-0 m-0 flex items-start">
              <div className="flex-1">
                <div className="flex flex-col w-full items-center justify-center p-2 z-40 sm:visible">
                  <NavigationLinks />
                </div>
              </div>
              <div className="flex-none z-50 p-2 pr-4">
              </div>
            </div>

          </div>
        </div>
      )}

      <Outlet />
    </>
  );
};

export default Navigation;
