import {
  Outlet, Link, useLocation,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { useEffect, useState } from 'react';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.componenet';

import { selectCurrentUser } from '../../store/user/user.selector';

import { ReactComponent as ProfileIcon } from '../../assets/person_FILL0.svg';
import { ReactComponent as ShoppingIcon } from '../../assets/local_mall.svg';
import { ReactComponent as AdminIcon } from '../../assets/engineering_FILL0.svg';
import { signOutStart } from '../../store/user/user.action';

import MenuIcon from '../menu/menu.component';
import { selectCartCount } from '../../store/cart/cart.selector';
import { getUserCollectionKeys, Keys } from '../../utils/firebase/firebase.utils';
import { SelectOption } from '../../components/select/select.component';


const Navigation = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const cartCount = useSelector(selectCartCount);
  const [userCollectionKeys, setUserCollectionKeys] = useState<Keys[]>([]);

  useEffect(() => {
    const featchUserCollectionKeys = async () => {
      try {
        const keys: Keys[] = await getUserCollectionKeys();
        setUserCollectionKeys(keys);
      } catch (error) {
        console.log(error);
      }
    };
    const featch = featchUserCollectionKeys();
  }, []);

  // useLocation is used to check if the current path if the admin dashbord to hide the web navbar
  const path = useLocation();
  const [TEST, setTEST] = useState('');

  const signOutUser = () => dispatch(signOutStart());
  console.log('TEST:', TEST);
  return (
    <>
      {!(path.pathname === '/admin-dashboard' || path.pathname.match(/^\/admin-dashboard(\/.*)?$/)) && (
        <div className="flex justify-center lg:px-4 md:py-2 pt-2">
          <div className="navbar flex-col m-0 bg-base-100 p-0">
            {/* main navbar */}
            <div className="navbar container min-h-fit p-0 m-0 flex ">
              <div className="flex-1 ">
                <div className="flex-none sm:flex-none">
                  <div className="flex flex-col w-full items-center justify-center pl-2 pt-2 z-40 sm:hidden">
                    <MenuIcon /> 
                  </div>
                </div>
                <div className="flex-none z-50 pl-2">
                  <Link to="/">
                    <div className="flex flex-col font-dosis whitespace-nowrap text-xl sm:text-3xl text-slate-700">
                      <img className="opacity-90 w-3/4 sm:w-full" src="/src/assets/NANA STYLE.png" alt="gfd" />
                    </div>
                  </Link>
                </div>
              </div>
              <div className="flex-none pt-2">
                <div className="flex w-full justify-end z-40">
                  <div className="pt-1">
                    <Link to="/admin-dashboard">
                      <AdminIcon className="w-9 hover:animate-pulse" />
                    </Link>
                  </div>
                  {
                    currentUser === null
                      ? (
                        <div className="flex-1 pt-3 px-4">
                          <Link to="/auth" className="font-dosis p-1 text-slate-700 link-underline link-underline-black tracking-wide">SIGN IN</Link>
                        </div>
                      )
                      : (
                        <div className="dropdown dropdown-end px-2 ">
                          <label tabIndex={0}>
                            <div className="relative cursor-pointer">
                              <ProfileIcon className="hover:animate-pulse w-11" />
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
                      <label>
                        <div className="relative pt-[1px] cursor-pointer">
                          <div tabIndex={0} className="relative flex items-center justify-center cursor-pointer hover:animate-pulse">
                            <ShoppingIcon />
                            <span className="absolute text-[10px] opacity-70 sm:text-xs font-bold pt-3">{cartCount}</span>
                          </div>
                        </div>
                      </label>
                      <div tabIndex={0} className="dropdown-content p-2 drop-shadow-2xl bg-base-100 rounded-box w-80 sm:w-96">
                        <CartDropdown />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            {/* categories navbar */}
            <div className="navbar min-h-min p-0 m-0 flex items-start justify-center">

              <div className="flex flex-col group w-fit items-center justify-center z-40 sm:visible">
                <div className="flex">
                  {/* MAPKEYS HERE */}
                  <div className="flex justify-center items-center">
                    <div className="px-3 static flex" onMouseEnter={() => setTEST('ani')} onMouseLeave={() => setTEST('yeayea')}>
                      <Link to="/shop" className="text-base font-dosis leading-0 p-1 text-slate-700 link-underline link-underline-black tracking-wide">
                        BOY
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="px-3 static flex " onMouseEnter={() => setTEST('itfor')}>
                      <Link to="/shop" className="text-base font-dosis leading-0 p-1 text-slate-700 link-underline link-underline-black tracking-wide">
                        GIRL
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="px-3 static flex " onMouseEnter={() => setTEST('otha')}>
                      <Link to="/shop" className="text-base font-dosis leading-0 p-1 text-slate-700 link-underline link-underline-black tracking-wide">
                        UNISEX
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="group-hover:opacity-100 opacity-0 group-hover:visible invisible absolute top-28 w-screen bg-gray-200 h-20 transition ease-in delay-200">
                  {TEST}
                </div>

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
