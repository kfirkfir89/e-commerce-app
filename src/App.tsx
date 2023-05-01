import {
  useEffect, lazy, Suspense, 
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet, 
} from 'react-router-dom';

import Spinner from './components/spinner/spinner.component';
import { checkUserSession } from './store/user/user.action';
import { PaymentSucceeded } from './routes/payment-succeeded/payment-succeeded.component';
import CategoriesPreview from './routes/categories-preview/categories-preview.componenet';
import Category from './routes/category/category.component';
import NotFound from './routes/not-found/not-found.component';
import { selectCategories } from './store/categories/category.selector';
import ItemPreview from './routes/item-preview/item-preview.component';
import AdminDBNav from './routes/admin-dashboard-nav/admin-db-nav.component';
import Dashboard from './components/dashboard/dashboard.component';
import AddFirebase from './components/add-firebase/add-firebase.component';
import Navigation from './routes/navigation/navigation.component';

const Home = lazy(() => import('./routes/home/home.component'));
const Authentication = lazy(() => import('./routes/authentication/authentication.component'));
const CheckOut = lazy(() => import('./routes/checkout/checkout.component'));


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

        <Route path=":shop/*" element={<Outlet />}>
          <Route index element={<CategoriesPreview />} errorElement={<NotFound />} />
          <Route path=":subCategoryPara/*" element={<Outlet />}>
            <Route index element={<Category />} />
            <Route path=":item" element={<ItemPreview />} />
          </Route>
        </Route>
        
        <Route path="auth" element={<Authentication />} />
        <Route path="checkout" element={<CheckOut />} />
        <Route path="payment-succeeded" element={<PaymentSucceeded />} />
        <Route path="admin-dashboard/*" element={<AdminDBNav />}>
          <Route index element={<Dashboard />} />
          <Route path="addfirebase" element={<AddFirebase />} />
        </Route>

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
