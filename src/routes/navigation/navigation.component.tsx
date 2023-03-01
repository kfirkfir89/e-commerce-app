import { Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import CartIcon from '../../components/cart-icon/cart-icon.component';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.componenet';

import { selectIsCartOpen } from '../../store/cart/cart.selector'; 
import { selectCurrentUser } from '../../store/user/user.selector';

import { ReactComponent as CrwnLogo } from '../../assets/crown.svg';
import { signOutStart } from '../../store/user/user.action';



const Navigation = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isCartOpen = useSelector(selectIsCartOpen);
  
  const signOutUser = () => dispatch(signOutStart());

  return (
    <>
      <div className="flex justify-center">
        <div className="container">
          <div className="navbar bg-base-100">
            
            <div className="flex-1">
              <Link to="/" className="btn btn-ghost normal-case text-xl"><CrwnLogo className="logo" /></Link>
            </div>

            <div className="flex-none">
              {
                  currentUser === null
                    ? (
                      <div className="flex-1">
                        <ul className="menu menu-horizontal px-1">
                          <li><Link to="/auth">Sign In</Link></li>
                        </ul>
                      </div>
                    )
                    : (
                      <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost">
                          <div className="w-10 rounded-full">
                            profile
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
              <CartIcon />
            </div>
            
            {isCartOpen && <CartDropdown />}
            
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="container">
          <div className="navbar bg-base-100">
            <div className="flex-1">
              <ul className="menu menu-horizontal px-1">
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/">Item 3</Link></li>
              </ul>
            </div>  
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default Navigation;
