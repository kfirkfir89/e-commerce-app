
import { useLocation, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Keys, getUserCollectionKeys, setUserCollectionKeys } from '../../utils/firebase/firebase.utils';
import { FeatchCategoriesInitialState, featchCategoriesInitialState } from '../../store/categories/category.action';

const Shop = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(featchCategoriesStart(location.state)); 
  //   console.log('state:', location.state);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch]);
  
  // async function featchUserCollectionKeys() {
  //   try {
  //     const keys: Keys[] = await getUserCollectionKeys();
  //     return keys[0].keys;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   const getKeys = async () => {
  //     const keys = await featchUserCollectionKeys();
  //     console.log('keys:', keys)
  //     return keys;
  //   };

  //   const userCollectionKeys = getKeys().then((res) => typeof res !== 'undefined' && dispatch(featchCategoriesInitialState(res)));

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
      <div>{location.state}</div>
      <Outlet />
    </>
  );
};

export default Shop;


