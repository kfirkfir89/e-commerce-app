
import { useLocation, Outlet } from 'react-router-dom';

const Shop = () => {
  const location = useLocation();

  // useEffect(() => {
  //   dispatch(featchCategoriesStart(location.state)); 
  //   console.log('state:', location.state);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch]);

  return (
    <>
      <div>{location.state}</div>
      <Outlet />
    </>
  );
};

export default Shop;
