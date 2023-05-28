import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ReactComponent as ProfileIcon } from '../../assets/person_FILL0.svg';
import { ReactComponent as LogoutIcon } from '../../assets/logout_FILL0.svg';
import { ReactComponent as AddressIcon } from '../../assets/home_FILL0.svg';
import { ReactComponent as OrderIcon } from '../../assets/package_FILL0.svg';
import { ReactComponent as DetailsIcon } from '../../assets/list_alt_FILL0.svg';

import { signOutStart } from '../../store/user/user.action';
import { selectCurrentUser } from '../../store/user/user.selector';

const UserProfile = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentUserSelector = useSelector(selectCurrentUser);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  let avatarNameShortcut = '';

  if (currentUserSelector) {
    avatarNameShortcut =
      currentUserSelector.firstName[0].toUpperCase() +
      currentUserSelector.lastName[0].toUpperCase();
  }

  useEffect(() => {
    // if (currentUserSelector) {
    //   setUser(currentUserSelector);
    // }
    // const fetch = async () => {
    //   try {
    //     const res = await getCurrentUser();
    //     if (res !== null) {
    //       res;
    //       setUserAuth(res);
    //     }
    //   } catch (error) {
    //     console.log('error:', error);
    //   }
    // };
    // const res = fetch();
  }, []);

  const signOutUser = () => dispatch(signOutStart());

  const openMenuHandler = () => {
    setIsOpenMenu(!isOpenMenu);
  };
  const setOptionHandler = () => setIsOpenMenu(!isOpenMenu);

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="container h-full max-w-6xl">
        <h2 className="mb-6 text-center text-2xl font-semibold capitalize text-slate-700 lg:m-2 lg:mb-8">
          My Account
        </h2>

        <div className="flex h-5/6 w-full gap-2 px-4 ">
          {!isOpenMenu && (
            <div className="w-1/3 flex-1 flex-col text-center font-smoochSans text-sm capitalize tracking-wider text-slate-700 md:flex ">
              <div className="relative mb-2 flex h-28 bg-gray-300 p-2 shadow-sm">
                <div className="absolute inset-4 -left-3 flex h-20 w-20 items-center justify-center rounded-full border-[1px] border-dashed border-slate-900 bg-accent pb-1">
                  <span className="pl-1 font-dosis text-3xl font-extrabold tracking-widest text-slate-600">
                    {avatarNameShortcut}
                  </span>
                </div>
                <div className="ml-1 flex flex-col items-start justify-center gap-1 pt-2 pl-16 font-dosis">
                  hi,
                  <span className="pb-2 text-base font-bold uppercase">
                    {currentUserSelector?.displayName}
                  </span>
                </div>
              </div>

              <ul className="flex h-full flex-col bg-gray-100 shadow-sm">
                <li className="relative flex flex-col">
                  <NavLink
                    onClick={setOptionHandler}
                    to="/my-account"
                    className={({ isActive }) =>
                      isActive
                        ? `${
                            location.pathname.charAt(
                              location.pathname.length - 1
                            ) === 't'
                              ? 'flex items-center bg-gray-200 p-1 py-2 font-semibold child-span:bg-accent'
                              : 'flex items-center p-1 py-2 hover:bg-gray-200 '
                          }`
                        : 'flex items-center p-2 hover:bg-gray-200 '
                    }
                  >
                    <ProfileIcon className="my-1 w-10 text-slate-500" />
                    My Account
                    <span className="absolute inset-0 -left-1 w-1 "></span>
                  </NavLink>
                </li>
                <li className="relative flex flex-col">
                  <NavLink
                    onClick={setOptionHandler}
                    to="details"
                    className={({ isActive }) =>
                      isActive
                        ? 'flex items-center bg-gray-200 p-2 font-semibold child-span:bg-accent'
                        : 'flex items-center p-2 hover:bg-gray-200 '
                    }
                  >
                    <DetailsIcon className="mr-2 w-8 text-slate-500" />
                    My Details
                    <span className="absolute inset-0 -left-1 w-1 "></span>
                  </NavLink>
                </li>
                <li className="relative flex flex-col">
                  <NavLink
                    to="address-book"
                    className={({ isActive }) =>
                      isActive
                        ? 'flex items-center bg-gray-200 p-2 font-semibold child-span:bg-accent'
                        : 'flex items-center p-2 hover:bg-gray-200'
                    }
                  >
                    <AddressIcon className="mr-2 w-8 text-slate-500" />
                    Address Book
                    <span className="absolute inset-0 -left-1 w-1 "></span>
                  </NavLink>
                </li>
                <li className="relative flex flex-col">
                  <NavLink
                    to="orders"
                    className={({ isActive }) =>
                      isActive
                        ? 'flex items-center bg-gray-200 p-2 font-semibold child-span:bg-accent'
                        : 'flex items-center p-2'
                    }
                  >
                    <OrderIcon className="mr-2 w-8 text-slate-500" />
                    My Orders
                    <span className="absolute inset-0 -left-1 w-1 "></span>
                  </NavLink>
                </li>
                <li className="relative flex flex-col">
                  <NavLink
                    onClick={signOutUser}
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? 'flex items-center bg-gray-200 p-2 font-semibold child-span:bg-accent'
                        : 'flex items-center p-2'
                    }
                  >
                    <LogoutIcon className="mr-2 w-8 text-slate-500" />
                    Sign Out
                    <span className="absolute inset-0 -left-1 w-1 "></span>
                  </NavLink>
                </li>
              </ul>
            </div>
          )}

          {isOpenMenu && (
            <div className="flex-1 bg-gray-100 font-smoochSans text-sm capitalize tracking-wider text-slate-700 shadow-sm">
              <button
                onClick={openMenuHandler}
                className="btn-circle btn absolute block md:hidden"
              >
                tet
              </button>
              <Outlet />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
