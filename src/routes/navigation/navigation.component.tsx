import { Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import CartIcon from '../../components/cart-icon/cart-icon.component';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.componenet';

import { selectIsCartOpen } from '../../store/cart/cart.selector'; 
import { selectCurrentUser } from '../../store/user/user.selector';

import { ReactComponent as CrwnLogo } from '../../assets/crown.svg';
import { ReactComponent as FaceMan } from '../../assets/face_FILL0.svg';
import { signOutStart } from '../../store/user/user.action';



const Navigation = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isCartOpen = useSelector(selectIsCartOpen);
  
  const signOutUser = () => dispatch(signOutStart());

  return (
    <>
      <div className="sticky top-0 z-50 flex justify-center sm:px-6">
        <div className="grid grid-cols-1 w-screen container">
          <div className="navbar">
            
            <div className="flex-1">
              <Link to="/">
                <div className="font-custom text-2xl sm:text-3xl text-slate-700 hover:text-secondary hover:animate-waving-hand">nana-style</div>
              </Link>
            </div>
            <div className="flex-none">
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
                      <div className="dropdown dropdown-end px-2">
                        <label tabIndex={0}>
                          <div className="sm:w-8 w-7 relative flex items-center justify-center cursor-pointer">
                            <FaceMan className="hover:text-secondary hover:animate-spin" />
                          </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                          <li>
                            <Link to="/" className="justify-between">
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
              <div className="dropdown dropdown-end w-full">
                <CartIcon />
                <div tabIndex={0} className="dropdown-content p-2 drop-shadow-2xl bg-base-100 rounded-box w-80 sm:w-96">
                  <CartDropdown />
                </div>
              </div>
            </div>
            
            
          </div>
          <div className="top-0 z-50 flex justify-center px-6 pb-4">
            <div className="container">
              <div className="navbar justify-center min-h-[20px] p-0">        
                <ul className="menu border-none outline-none rounded-none border-r-0 menu-horizontal px-1">
                  <div className="px-3">
                    <Link to="/shop" className="text-base font-dosis leading-0 p-1 text-slate-700 link-underline link-underline-black">
                      BOY
                    </Link>
                  </div>
                  <div className="px-3">
                    <Link to="/shop" className="text-base font-dosis leading-0 p-1 text-slate-700 link-underline link-underline-black">
                      GIRL
                    </Link>
                  </div>

                  <div className="px-3">
                    <Link to="/shop" className="text-base font-dosis leading-0 p-1 text-slate-700 link-underline link-underline-black">
                      SHOP
                    </Link>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default Navigation;
