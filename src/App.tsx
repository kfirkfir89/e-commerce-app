import {
  useEffect, lazy, Suspense, 
} from 'react';
import { useDispatch } from 'react-redux';
import {
  Route, createBrowserRouter, createRoutesFromElements, RouterProvider, 
} from 'react-router-dom';

import Spinner from './components/spinner/spinner.component';
import { checkUserSession } from './store/user/user.action';
import { PaymentSucceeded } from './routes/payment-succeeded/payment-succeeded.component';
import CategoriesPreview from './routes/categories-preview/categories-preview.componenet';
import NotFound from './routes/not-found/not-found.component';
import ItemPreview from './routes/item-preview/item-preview.component';
import AdminDBNav from './routes/admin-dashboard-nav/admin-db-nav.component';
import Dashboard from './components/dashboard/dashboard.component';
import AddFirebase from './components/add-firebase/add-firebase.component';
import Navigation from './routes/navigation/navigation.component';
import Category from './routes/category/category.component';
import SearchResults from './routes/search-results/search-results.component';

const Home = lazy(() => import('./routes/home/home.component'));
const Authentication = lazy(() => import('./routes/authentication/authentication.component'));
const CheckOut = lazy(() => import('./routes/checkout/checkout.component'));


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);

  const router = createBrowserRouter((
    createRoutesFromElements(
      <Route path="/*" element={<Navigation />}>
        <Route index element={<Home />} />

        <Route path=":shopPara" element={<CategoriesPreview />} />
        <Route path=":shopPara/:subCategoryPara" element={<Category />} />
        <Route path=":shopPara/:subCategoryPara/:item" element={<ItemPreview />} />
        
        <Route path="authentication" element={<Authentication />} />
        <Route path="checkout" element={<CheckOut />} />
        <Route path="payment-succeeded" element={<PaymentSucceeded />} />
        <Route path="search-results" element={<SearchResults />} />
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
