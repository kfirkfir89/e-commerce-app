import {
  useEffect, lazy, Suspense, useMemo, 
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Route, createBrowserRouter, createRoutesFromElements, RouterProvider, 
} from 'react-router-dom';

import Spinner from './components/spinner/spinner.component';
import { checkUserSession } from './store/user/user.action';
import { PaymentSucceeded } from './routes/payment-succeeded/payment-succeeded.component';
import AdminDashboard from './routes/admin-dashboard/admin-dashboard.component';
import AdminDBNav from './routes/admin-dashboard-nav/admin-db-nav.component';
import CategoriesPreview from './routes/categories-preview/categories-preview.componenet';
import Category from './routes/category/category.component';
import NotFound from './routes/not-found/not-found.component';
import { selectCategories } from './store/categories/category.selector';

const Home = lazy(() => import('./routes/home/home.component'));
const Authentication = lazy(() => import('./routes/authentication/authentication.component'));
const Navigation = lazy(() => import('./routes/navigation/navigation.component'));
const CheckOut = lazy(() => import('./routes/checkout/checkout.component'));
const Shop = lazy(() => import('./routes/shop/shop.component'));


const App = () => {
  const dispatch = useDispatch();
  const categoriesMap = useSelector(selectCategories);

  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);

  const router = createBrowserRouter((
    createRoutesFromElements(
      <Route path="/*" element={<Navigation />}>
        <Route index element={<Home />} />

        <Route path=":shop/*" element={<Shop />}>
          <Route index element={<CategoriesPreview />} errorElement={<NotFound />} />
          <Route path=":subCategoryPara" element={<Category />} />
        </Route>
        
        <Route path="auth" element={<Authentication />} />
        <Route path="checkout" element={<CheckOut />} />
        <Route path="payment-succeeded" element={<PaymentSucceeded />} />
        <Route path="admin-dashboard/*" element={<AdminDashboard />} />

        <Route path="*" element={<NotFound />} />
      </Route>,
    )
  ));
  return (
    <Suspense fallback={<Spinner />}>
      <RouterProvider router={router} />
    </Suspense>
  ); 
};
export default App;
