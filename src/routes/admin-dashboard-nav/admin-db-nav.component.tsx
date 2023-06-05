import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminDBNav = () => {
  const path = useLocation();

  return (
    <>
      <div className="flex justify-center md:px-2">
        <div className="container navbar m-0 flex-col bg-base-100">
          <div className="navbar m-0 flex min-h-fit p-0 ">
            <div className="flex-1 ">
              {/* <div className="flex-none sm:flex-none">
                <div className="flex flex-col w-full items-center justify-center pl-2 pt-2 z-40 sm:hidden">
                  <SideMenu /> 
                </div>
              </div> */}
              <div className="z-50 flex-none ">
                <Link to="/">
                  <div className="flex flex-col whitespace-nowrap font-dosis text-xl text-slate-700 sm:text-3xl">
                    <img
                      className="w-3/4 opacity-90 sm:w-full"
                      src="/src/assets/NANA STYLE.png"
                      alt="gfd"
                    />
                  </div>
                </Link>
              </div>
            </div>
            <div className="z-40 flex w-full flex-wrap justify-center">
              <div className="flex justify-center">
                <Link
                  to="/admin-dashboard"
                  className={`btn-ghost btn-xs btn mx-2 text-gray-700 sm:btn-sm ${
                    path.pathname === '/admin-dashboard' ? 'bg-gray-300' : ''
                  }`}
                >
                  Dashboard
                </Link>
              </div>
              <div className="flex justify-center">
                <Link
                  to="addfirebase"
                  className="btn-ghost btn-xs btn mx-2 text-gray-700 sm:btn-sm"
                >
                  Update Stock
                </Link>
              </div>
              <div className="flex justify-center">
                <Link
                  to="addfirebase"
                  className="btn-ghost btn-xs btn mx-2 text-gray-700 sm:btn-sm"
                >
                  Delete Products
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
