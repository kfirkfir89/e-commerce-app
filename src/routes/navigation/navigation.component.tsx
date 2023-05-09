import {
  Outlet, Link, useLocation, useParams, NavLink,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  memo, useEffect, useMemo, useState, 
} from 'react';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.componenet';

import { selectCurrentUser } from '../../store/user/user.selector';

import { ReactComponent as ProfileIcon } from '../../assets/person_FILL0.svg';
import { ReactComponent as ShoppingIcon } from '../../assets/local_mall.svg';
import { ReactComponent as AdminIcon } from '../../assets/engineering_FILL0.svg';
import { signOutStart } from '../../store/user/user.action';

import MenuIcon from '../menu/menu.component';
import { selectCartCount } from '../../store/cart/cart.selector';
import {
  UserCollectionKeys,
  getUserCategories, getUserCollectionKeys,
} from '../../utils/firebase/firebase.utils';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';

export type ShopCategoryRouteParams = {
  shopPara: string
};

const Navigation = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const cartCount = useSelector(selectCartCount);

  const [isHover, setIsHover] = useState(false);
  const [isMenuIconToggled, setIsMenuIconToggled] = useState(false);
  const [hoverSelected, setHoverSelected] = useState('');
  const [userCategories, setUserCategories] = useState<Map<string, string[]>>();
  const [userCollectionKeys, setUserCollectionKeys] = useState<UserCollectionKeys>();

  const { shopPara } = useParams<keyof ShopCategoryRouteParams>() as ShopCategoryRouteParams;
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
  const toggleIsMenuOpen = () => setIsMenuIconToggled(!isMenuIconToggled);

  // useLocation is used to check if the current path if the admin dashbord to hide the web navbar
  const path = useLocation();
  
  const memorizedCategories = useMemo(() => userCategories?.get(hoverSelected), [hoverSelected, userCategories]);
  const signOutUser = () => dispatch(signOutStart());
  return (
    <>
      {!(path.pathname === '/admin-dashboard' || path.pathname.match(/^\/admin-dashboard(\/.*)?$/)) && (
        <div className="flex justify-center w-screen z-[100] absolute">

          <div className="flex-col p-0 m-0 navbar">
            {/* main navbar */}
            
            <div className=" flex py-6 navbar justify-center min-h-fit gradient-bg-nav sm:p-4 p-0">
              <div className="flex navbar min-h-fit container bg-transparent sm:p-4 p-0">
                {/* LEFT SIDE LOGO MENU */}
                <div className="flex-1">
                  <div className="flex-none">
                    {
                      userCategories !== undefined
                    && (
                      // side menu for small screens
                    <div className="z-40 flex flex-col items-center justify-center pt-2 sm:hidden ">
                      <MenuIcon onChangeToggle={toggleIsMenuOpen} categories={userCategories} /> 
                    </div>
                    )
                    }
                  </div>
                  <div className="sm:flex-none z-50">
                    <Link to="/">
                      <div className="flex ">
                        <img className="w-8/12 pl-2 opacity-90 sm:w-full" src="/src/assets/NANA STYLE.png" alt="gfd" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* RIGTH SIDE NAV BUTTONS */}
                <div className="flex-none pt-2">
                  <div className="z-40 flex justify-end w-full">
                    {/* SIGNIN PROFILE ADMINDB */}
                    <div className="pt-1">
                      <Link to="/admin-dashboard">
                        <AdminIcon className="w-8 sm:w-9 hover:animate-pulse" />
                      </Link>
                    </div>
                    {
                    currentUser === null
                      ? (
                        <div className="flex-1 px-4 pt-3">
                          <Link to="/auth" className="p-1 tracking-wide font-dosis text-slate-700 link-underline link-underline-black">SIGN IN</Link>
                        </div>
                      )
                      : (
                        <div className="px-1 dropdown dropdown-end sm:px-2">
                          <label tabIndex={0}>
                            <div className="relative cursor-pointer">
                              <ProfileIcon className="w-10 hover:animate-pulse sm:w-11" />
                            </div>
                          </label>
                          <ul tabIndex={0} className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
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
                    {/* CART */}
                    <div className="z-50 flex-none pr-1 sm:pr-4">
                      <div className="w-full dropdown dropdown-end">
                        <label>
                          <div className="relative sm:pt-[1px] cursor-pointer">
                            <div tabIndex={0} className="relative flex items-center justify-center cursor-pointer hover:animate-pulse">
                              <ShoppingIcon className="w-9 sm:w-full" />
                              <span className="absolute text-[10px] opacity-70 sm:text-xs font-bold pt-3">{cartCount}</span>
                            </div>
                          </div>
                        </label>
                        <div tabIndex={0} className="p-2 dropdown-content drop-shadow-2xl bg-base-100 rounded-box w-80 sm:w-96">
                          <CartDropdown />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* categories navbar */}
            <div className=" items-start justify-center p-0 m-0 navbar min-h-min hidden sm:flex">
              <div className="z-40 relative flex items-center justify-center group w-fit sm:visible">

                <div className="flex absolute top-0">
                  {userCollectionKeys && userCollectionKeys.keys.map((key) => (
                    <div key={key} className="flex justify-center peer mb-6">
                      <div className="static flex px-3" onMouseEnter={() => { setIsHover(true); setHoverSelected(key); }}>
                        <NavLink to={key} className="p-1 text-sm tracking-[0.075em] font-smoochSans leading-0 text-slate-700 link-underline link-underline-black">
                          {key.toUpperCase()}
                        </NavLink>
                      </div>
                    </div>
                  ))}
                </div>

                <div onBlur={() => setIsHover(false)} tabIndex={0} onMouseLeave={() => setIsHover(false)} className={`bg-gray-200 pb-2 top-0 grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out peer-hover:grid-rows-[1fr] ${isHover ? 'grid-rows-[1fr] border-b-[1px] border-slate-400 border-dashed' : ''}  w-screen top-24 sm:top-28`}>
                  <div className={`overflow-hidden flex justify-center mt-8 pt-2 ${isHover ? 'visible' : 'invisible'} `}>
                    <div className="flex w-96">
                      <div className="flex gap-y-1 flex-col items-start mt-2">
                        {memorizedCategories?.map((sc) => (
                          <div key={sc} className="flex items-center justify-center">
                            <div className="static flex px-3 justify-start">
                              <NavLink
                                to={`${hoverSelected}/${sc}`}
                                className={({ isActive }) => (isActive ? 'p-1 text-sm z-50 tracking-widest text-slate-900 font-smoochSans leading-0 hover:text-slate-900 underline underline-offset-4' : 'p-1 text-sm z-50 tracking-widest text-slate-500 font-smoochSans leading-0 hover:text-slate-900')}
                              >
                                {sc.charAt(0).toUpperCase() + sc.slice(1, sc.length)}       
                              </NavLink>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>

          </div>
        </div>
      )}
      <div className={`sm:pt-48 pt-28 ${isMenuIconToggled ? 'hidden' : 'block'}`}>
        <Breadcrumbs />
        <Outlet />
      </div>
    </>
  );
};

export default memo(Navigation);
