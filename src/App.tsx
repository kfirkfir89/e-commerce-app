import { useEffect, lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import Spinner from './components/spinner/spinner.component';
import { checkUserSession } from './store/user/user.action';
import { PaymentSucceeded } from './routes/payment-succeeded/payment-succeeded.component';

const Home = lazy(() => import('./routes/home/home.component'));
const Authentication = lazy(() => import('./routes/authentication/authentication.component'));
const Navigation = lazy(() => import('./routes/navigation/navigation.component'));
const CheckOut = lazy(() => import('./routes/checkout/checkout.component'));
const Shop = lazy(() => import('./routes/shop/shop.component'));


const App = () => {
  const dispatch = useDispatch();
    
  /*   useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if(user){
        createUserDocumentFromAuth(user);
      }
      dispatch(setCurrentUser(user));
    });

    return unsubscribe; //close the session of the listener..return is clear function on useEffect
  }, [])
   */
  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/*" element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="shop/*" element={<Shop />} />
          <Route path="auth" element={<Authentication />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route path="payment-succeeded" element={<PaymentSucceeded />} />
        </Route>
      </Routes>
    </Suspense>
  ); 
};
export default App;
