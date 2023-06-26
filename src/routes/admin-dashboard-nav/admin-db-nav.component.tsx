import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ReactComponent as NanaIcon } from '../../assets/nanalogo.svg';

const AdminDBNav = () => {
  const path = useLocation();

  return (
    <>
      <div className="flex justify-center bg-gray-100 md:px-2">
        <div className="container navbar m-0 flex-col bg-gray-100">
          <div className="navbar m-0 flex min-h-fit p-0 ">
            <div className="z-40 flex w-full flex-wrap justify-center">
              {/* <div className="flex justify-center">
                <Link
                  to="admin-dashboard"
                  className={`btn-ghost btn-xs btn mx-2 text-gray-700 sm:btn-sm ${
                    path.pathname === '/admin-dashboard' ? 'bg-gray-300' : ''
                  }`}
                >
                  dashboard
                </Link>
              </div> */}
              <div className="flex justify-center">
                <NavLink
                  to="pages-preview"
                  className={({ isActive }) =>
                    isActive
                      ? 'btn-ghost btn-xs btn mx-2 bg-gray-300 text-gray-700 sm:btn-sm'
                      : 'btn-ghost btn-xs btn mx-2 text-gray-700 sm:btn-sm'
                  }
                >
                  pages preview
                </NavLink>
              </div>
              <div className="flex justify-center">
                <NavLink
                  to="product-list"
                  className={({ isActive }) =>
                    isActive
                      ? 'btn-ghost btn-xs btn mx-2 bg-gray-300 text-gray-700 sm:btn-sm'
                      : 'btn-ghost btn-xs btn mx-2 text-gray-700 sm:btn-sm'
                  }
                >
                  product list
                </NavLink>
              </div>
              <div className="flex justify-center ">
                <NavLink
                  to="addfirebase"
                  className={({ isActive }) =>
                    isActive
                      ? 'btn-ghost btn-xs btn mx-2 bg-gray-300 text-gray-700 sm:btn-sm'
                      : 'btn-ghost btn-xs btn mx-2 text-gray-700 sm:btn-sm'
                  }
                >
                  Add Products
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="scrollbarStyle flex h-full w-full flex-col px-4">
        <div className="flex-grow ">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminDBNav;
