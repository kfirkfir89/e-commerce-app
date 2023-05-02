import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const crumbs = location.pathname.split('/');
  let currentLink = '';

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      { location.pathname !== '/'
      && (
      <>
        <div className="flex justify-center">
          <div className="container">
            <div className="text-sm breadcrumbs mx-4">
              <ul>
                <li>
                  <Link to="/">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 pr-1 text-gray-400">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>

                  </Link>
                </li>
                {
                crumbs.filter((crumb: string) => crumb !== '')
                  .map((crumb: string) => {
                    currentLink += `/${crumb}`;
                    return (
                      <li key={crumb}>
                        <Link key={crumb} to={currentLink}>{crumb.replace(/%20/g, '-').toLowerCase()}</Link>
                      </li>
                    );
                  })
                }
              </ul>
            </div>
          </div>
        </div>
        <div className="divider"></div>
      </>
      )}
    </>
  );
};

export default Breadcrumbs;
