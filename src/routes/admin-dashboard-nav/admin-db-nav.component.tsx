import { Link, Outlet, useLocation } from 'react-router-dom';
import { ReactComponent as NanaIcon } from '../../assets/nanalogo.svg';

const AdminDBNav = () => {
  const path = useLocation();

  return (
    <>
      <div className="flex justify-center bg-gray-100 md:px-2">
        <div className="container navbar m-0 flex-col bg-gray-100">
          <div className="navbar m-0 flex min-h-fit p-0 ">
            <div className="flex-1 ">
              <div className="z-50 flex-none ">
                <Link to="/">
                  <div className="relative mt-2 flex">
                    <NanaIcon className="h-10 w-full " />
                  </div>
                </Link>
              </div>
            </div>
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
                <Link
                  to="pages-preview"
                  className={`btn-ghost btn-xs btn mx-2 text-gray-700 sm:btn-sm ${
                    path.pathname === '/pages-preview' ? 'bg-gray-300' : ''
                  }`}
                >
                  pages preview
                </Link>
              </div>
              <div className="flex justify-center">
                <Link
                  to="product-list"
                  className={`btn-ghost btn-xs btn mx-2 text-gray-700 sm:btn-sm ${
                    path.pathname === '/pages-preview' ? 'bg-gray-300' : ''
                  }`}
                >
                  product list
                </Link>
              </div>
              <div className="flex justify-center ">
                <Link
                  to="addfirebase"
                  className={`btn-ghost btn-xs btn mx-2 text-gray-700 sm:btn-sm ${
                    path.pathname === '/admin-dashboard/addfirebase'
                      ? 'bg-gray-300'
                      : ''
                  }`}
                >
                  Add Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default AdminDBNav;
