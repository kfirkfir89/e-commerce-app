import {
  Outlet, Link, useLocation, useParams, NavLink,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { useEffect, useMemo, useState } from 'react';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.componenet';

import { selectCurrentUser } from '../../store/user/user.selector';

import { ReactComponent as ProfileIcon } from '../../assets/person_FILL0.svg';
import { ReactComponent as ShoppingIcon } from '../../assets/local_mall.svg';
import { ReactComponent as AdminIcon } from '../../assets/engineering_FILL0.svg';
import { signOutStart } from '../../store/user/user.action';

import MenuIcon from '../menu/menu.component';
import { selectCartCount } from '../../store/cart/cart.selector';
import {
  getAllCategoriesAndDocuments, getUserCategories, getUserCollectionKeys, Keys, 
} from '../../utils/firebase/firebase.utils';
import { featchAllCategoriesStart, featchCategoriesInitialState, featchCategoriesStart } from '../../store/categories/category.action';

export type ShopCategoryRouteParams = {
  shop: string
};

const Navigation = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const cartCount = useSelector(selectCartCount);

  const [isHover, setIsHover] = useState(false);
  const [hoverSelected, setHoverSelected] = useState('');
  const [userCategories, setUserCategories] = useState<Map<string, string[]> | null>(null);
  const [userCollectionKeys, setUserCollectionKeys] = useState<Keys | null >(null);

  const { shop } = useParams<keyof ShopCategoryRouteParams>() as ShopCategoryRouteParams;
  // featch only the userKeys(collectionKeys) from the system-data obj
  useEffect(() => {
    const featchUserCollectionKeys = async () => {
      try {
        const keys: Keys[] = await getUserCollectionKeys();
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

  // useLocation is used to check if the current path if the admin dashbord to hide the web navbar
  const path = useLocation();
  
  const memorizedCategories = useMemo(() => userCategories?.get(hoverSelected), [hoverSelected, userCategories]);

  const signOutUser = () => dispatch(signOutStart());
  return (
    <>
      {!(path.pathname === '/admin-dashboard' || path.pathname.match(/^\/admin-dashboard(\/.*)?$/)) && (
        <div className="flex justify-center pt-2 lg:px-4 md:py-2">
          <div className="flex-col p-0 m-0 navbar bg-base-100">
            {/* main navbar */}
            <div className="container flex p-0 m-0 navbar min-h-fit">

              <div className="flex-1">
                <div className="flex-none">
                  <div className="z-40 flex flex-col items-center justify-center pt-2 pl-2 sm:hidden">
                    <MenuIcon /> 
                  </div>
                </div>
                <div className="sm:flex-none z-50 sm:pl-2">
                  <Link to="/">
                    <div className="flex ">
                      <img className="w-8/12 pl-2 opacity-90 sm:w-full" src="/src/assets/NANA STYLE.png" alt="gfd" />
                    </div>
                  </Link>
                </div>
              </div>

              <div className="flex-none pt-2">
                <div className="z-40 flex justify-end w-full">
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

            {/* categories navbar */}
            <div className=" items-start justify-center p-0 m-0 navbar min-h-min hidden sm:flex">
              <div className="z-40 flex flex-col items-center justify-center group w-fit sm:visible">
                <div className="flex">
                  {userCollectionKeys && userCollectionKeys.keys.map((key) => (
                    <div key={key} className="flex items-center justify-center">
                      <div className="static flex px-3" onMouseEnter={() => { setIsHover(true); setHoverSelected(key); }}>
                        <NavLink to={key} className="p-1 text-base tracking-wide font-dosis leading-0 text-slate-700 link-underline link-underline-black">
                          {key.toUpperCase()}
                        </NavLink>
                      </div>
                    </div>
                  ))}
                </div>

                {isHover
                && (
                <div onBlur={() => setIsHover(false)} tabIndex={0} onMouseLeave={() => setIsHover(false)} className="absolute flex justify-center w-screen py-4 transition ease-in delay-300 bg-gray-200 top-24 sm:top-28">
                  {memorizedCategories?.map((sc) => (
                    <div key={sc} className="flex items-center justify-center">
                      <div className="static flex px-3">
                        <NavLink to={`${hoverSelected}/${sc}`} className="p-1 text-base tracking-wide font-dosis leading-0 text-slate-700 link-underline link-underline-black">
                          {sc.toUpperCase()}
                        </NavLink>
                      </div>
                    </div>
                  ))}
                </div>
                )}
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
