import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const crumbs = location.pathname.split('/');
  let currentLink = '';

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {location.pathname !== '/' && (
        <>
          <div className="flex w-full flex-col justify-center overflow-auto sm:py-3 sm:pb-2">
            <div className="container w-full">
              <div className="breadcrumbs mx-4 p-0 text-sm">
                <ul>
                  <li className="pb-[2px]">
                    <Link to="/">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5 pr-1 text-gray-400 hover:text-slate-600"
                      >
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                      </svg>
                    </Link>
                  </li>
                  {crumbs
                    .filter((crumb: string) => crumb !== '')
                    .map((crumb: string) => {
                      currentLink += `/${crumb}`;
                      return (
                        crumb !== 'product-list' && (
                          <li key={crumb}>
                            <Link
                              className="font-smoochSans text-xs tracking-widest text-gray-400 hover:text-slate-600"
                              key={crumb}
                              to={currentLink}
                            >
                              {crumb.replace(/%20/g, '-').toLowerCase()}
                            </Link>
                          </li>
                        )
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
          <div className="divider m-0"></div>
        </>
      )}
    </>
  );
};

export default Breadcrumbs;
