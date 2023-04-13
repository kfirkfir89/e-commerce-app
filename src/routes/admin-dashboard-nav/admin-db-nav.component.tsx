import {
  Link, Outlet, useLocation, 
} from 'react-router-dom';
import MenuIcon from '../menu/menu.component';


const AdminDBNav = () => {
  const path = useLocation();

  return (
    <>
      <div className="flex justify-center md:px-2">
        <div className="navbar container flex-col m-0 bg-base-100">
          <div className="navbar min-h-fit p-0 m-0 flex ">
            <div className="flex-1 ">
              <div className="flex-none sm:flex-none">
                <div className="flex flex-col w-full items-center justify-center pl-2 pt-2 z-40 sm:hidden">
                  <MenuIcon /> 
                </div>
              </div>
              <div className="flex-none z-50 ">
                <Link to="/">
                  <div className="flex flex-col font-dosis whitespace-nowrap text-xl sm:text-3xl text-slate-700">
                    <img className="opacity-90 w-3/4 sm:w-full" src="/src/assets/NANA STYLE.png" alt="gfd" />
                  </div>
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap justify-center w-full z-40">
              <div className="flex justify-center">
                <Link to="/admin-dashboard" className={`btn btn-ghost btn-xs sm:btn-sm mx-2 text-gray-700 ${path.pathname === '/admin-dashboard' ? 'bg-gray-300' : ''}`}>Dashboard</Link>
              </div>
              <div className="flex justify-center">
                <Link to="addfirebase" className="btn btn-ghost btn-xs sm:btn-sm mx-2 text-gray-700">Update Stock</Link>
              </div>
              <div className="flex justify-center">
                <Link to="addfirebase" className="btn btn-ghost btn-xs sm:btn-sm mx-2 text-gray-700">Delete Products</Link>
              </div>
              <div className="flex justify-center ">
                <Link to="addfirebase" className={`btn btn-ghost btn-xs sm:btn-sm mx-2 text-gray-700 ${path.pathname === '/admin-dashboard/addfirebase' ? 'bg-gray-300' : ''}`}>Add Products</Link>
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
