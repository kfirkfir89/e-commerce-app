
import { useLocation, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { memo, useEffect } from 'react';
import { Keys, getUserCollectionKeys, setUserCollectionKeys } from '../../utils/firebase/firebase.utils';
import { FeatchCategoriesInitialState, featchCategoriesInitialState } from '../../store/categories/category.action';

const Shop = () => {
  const location = useLocation();

  return (
    <>
      <div>{location.state}</div>
      <Outlet />
    </>
  );
};

export default memo(Shop);


