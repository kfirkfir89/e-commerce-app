import {
  Link, Outlet, useLocation, 
} from 'react-router-dom';


const AdminDBNav = () => {
  const path = useLocation();

  return (
    <>
      <div className="flex justify-center md:px-5 md:py-2">
        <div className="navbar container flex-col m-0 bg-base-100">
          {/* main navbar */}
          <div className="navbar flex-wrap min-h-fit p-0 m-0 flex items-start">
            <div className="flex flex-wrap justify-center w-full z-40">
              <div className="flex justify-center">
                <Link to="/admin-dashboard" className={`btn btn-ghost btn-xs sm:btn-sm mx-2 text-gray-700 ${path.pathname === '/admin-dashboard' ? 'bg-gray-300' : ''}`}>Dashboard</Link>
              </div>
              <div className="flex justify-center">
                <Link to="/" className="btn btn-ghost btn-xs sm:btn-sm mx-2 text-gray-700">Site</Link>
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
